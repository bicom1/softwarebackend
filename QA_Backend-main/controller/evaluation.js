const evaluationModel = require("../model/Evaluation");
const userModel = require("../model/user");
const evaluationRating = require("../model/rating");

exports.evaluation = async (req, res) => {
  try {
    const evaluationDate = new Date();
    const utcDate = new Date(
      Date.UTC(
        evaluationDate.getFullYear(),
        evaluationDate.getMonth(),
        evaluationDate.getDate()
      )
    );

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const data = {
      owner: req.user._id,
      useremail: user.email,
      leadID: req.body.leadId,
      agentName: req.body.agentName,
      mod: req.body.mod,
      teamleader: req.body.teamleader,
      greetings: req.body.greetings,
      accuracy: req.body.accuracy,
      building: req.body.building,
      presenting: req.body.presenting,
      closing: req.body.closing,
      bonus: req.body.bonus,
      evaluationsummary: req.body.evaluationsummary,
    //   evaluationpoints: Array.isArray(req.body.evaluationpoints) 
    // ? req.body.evaluationpoints.filter(point => typeof point === 'string')
    // : [],
      createdAt: utcDate,
    };
    const evaluation = new evaluationModel(data);
    await evaluation.save();

    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { evaluationdetail: evaluation._id },
    });

    const evaluationRate = new evaluationRating({
      owner: req.user._id,
      evaluatedRating: evaluation._id,
      rating: req.body.rating,
    });
    await evaluationRate.save();

    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { evaluationRating: evaluationRate._id },
    });

    res.status(202).json({ evaluation, message: "created!", success: true });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.EvaluationFromCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId, "evaluationdetail");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const evaluationCount = user.evaluationRating.length;

    res.status(200).json({
      success: true,
      userId: userId,
      evaluationCount: evaluationCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
