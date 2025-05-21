const User = require("../model/user");
const teamlead = require("../model/TeamLead");
const escalation = require("../model/Escalation");
const evaluation = require("../model/Evaluation");
const jwt = require("jsonwebtoken");
const Marketing = require("../model/Marketing");
const Ppc = require("../model/Ppc").default;

exports.userRegister = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      name: req.body.name,
    };
    const details = await User(data);
    await details.save();
    res.status(202).json({ details, message: "created", success: true });
  } catch (error) {
    res.status(500).json({ message: error, success: false });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        userEmail: user.email,
      },
      process.env.JWT_TOKEN
    );
    res
      .status(200)
      .json({ message: "Login successful", user, token, success: true });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.agentNameshow = async (req, res) => {
  try {
    const users = await User.find({}, "name role");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.fetchUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    // .populate("evaluationRating");
    const filteredUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      role: user.role,
      evaluationRating: user.evaluationRating,
    }));

    res.status(200).json({ users: filteredUsers, success: true });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchEvaluation = async (req, res) => {
  try {
    const user = await evaluation.find({ owner: req.params.id });

    res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchEscalation = async (req, res) => {
  try {
    const user = await escalation.find({ owner: req.params.id });
    res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.fetchppc = async (req, res) => {
//   console.log("Hitting fetchppc endpoint with ID:", req.params.id);
//   try {
//     const user = await Ppc.find({ owner: req.params.id });
//     res.status(200).json({ user, success: true });
//   } catch (error) {
//     console.error("Error in fetchppc:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.fetchmarketing = async (req, res) => {
  console.log("Hitting fetchmarketing endpoint with ID:", req.params.id);
  try {
    const marketingData = await Marketing.find({ owner: req.params.id });
    res.status(200).json({ marketingData, success: true });
  } catch (error) {
    console.error("Error in fetchmarketing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.fetchUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("escalationdetail")
      .populate("evaluationdetail")
      .populate("evaluationRating");

    const uniqueEscalations = [];
    const uniqueEvaluations = [];
    const seenAgents = new Set();

    user.escalationdetail.forEach((entry) => {
      if (!seenAgents.has(entry.agentName)) {
        seenAgents.add(entry.agentName);
        uniqueEscalations.push(entry);
      }
    });

    user.evaluationdetail.forEach((entry) => {
      if (!seenAgents.has(entry.agentName)) {
        seenAgents.add(entry.agentName);
        uniqueEvaluations.push(entry);
      }
    });

    const counts = {
      average: 0,
      good: 0,
      bad: 0,
      total: 0,
    };

    uniqueEscalations.forEach((entry) => {
      counts[entry.userrating]++;
    });

    counts["total"] = counts.average + counts.good + counts.bad;
    res.status(200).json({
      user: {
        ...user.toObject(),
        escalationdetail: uniqueEscalations,
        evaluationdetail: uniqueEvaluations,
      },
      counts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const escaltionDetails = await escalation.find({
      agentName: `${req.params.name}`,
    });
    const evaluationDetails = await evaluation.find({
      agentName: `${req.params.name}`,
    });
    const counts = {
      average: 0,
      good: 0,
      bad: 0,
      total: 0,
    };

    escaltionDetails.forEach((entry) => {
      counts[entry.userrating]++;
      counts["total"] = counts.average + counts.good + counts.bad;
    });

    res.status(200).json({
      esc: escaltionDetails,
      ev: evaluationDetails,
      counts,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserEvaluationAndEscalation = async (req, res) => {
  try {
    const { id } = req.params;
    let escaltionDetails;
    let evaluationDetails;
    const query = { owner: id };

    escaltionDetails = await escalation.find(query);
    evaluationDetails = await evaluation.find(query);

    res
      .status(200)
      .json({ esc: escaltionDetails, ev: evaluationDetails, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addLeader = async (req, res) => {
  try {
    const data = {
      leadName: req.body.leadname,
    };
    const details = await teamlead(data);
    await details.save();
    res.status(202).json({ details, success: true, message: "created" });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", success: false });
  }
};

exports.deleteLeader = async (req, res) => {
  try {
    await teamlead.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted", success: true });
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};

exports.fetchTeamLead = async (req, res) => {
  try {
    const data = await teamlead.find();
    res.json({ data, success: true });
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .json({
        success: true,
        message: "logout!",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
