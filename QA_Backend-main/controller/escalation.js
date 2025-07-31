const escalationModel = require("../model/Escalation");
const userModel = require("../model/user");

exports.escalation = async (req, res) => {
  try {
    const escalationDate = new Date();
    const utcDate = new Date(
      Date.UTC(
        escalationDate.getFullYear(),
        escalationDate.getMonth(),
        escalationDate.getDate()
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
      evaluatedby: req.body.evaluatedBy,
      agentName: req.body.agentName,
      teamleader: req.body.teamLeader,
      leadsource: req.body.leadSource,
      leadstatus: req.body.leadStatus,
      escalationseverity: req.body.escSeverity,
      issueidentification: req.body.issueIden,
      escalationaction: req.body.escAction,
      additionalsuccessrmation: req.body.successmaration,
      userrating: req.body.userrating,
      createdAt: utcDate,
    };

    if (req.file) {
      data.audio = req.file.path;
    }

    const escalation = new escalationModel(data);
    await escalation.save();

    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { escalationdetail: escalation._id },
    });

    res.status(202).json({ escalation, message: "Escalation created!", success: true });
  } catch (error) {
    console.error("Error creating escalation:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};



exports.getFilteredEscalations = async (req, res) => {
  try {
    let { filter } = req.query;
    const query = {};

    if (filter) {
      filter = filter.toLowerCase();
      query.userrating = filter;
    }

    console.log("Filter:", filter);
    const escalations = await escalationModel.find(query);

    console.log("Escalations found:", escalations);

    res
      .status(200)
      .json({ escalations, message: "Filtered results", success: true });
  } catch (error) {
    console.error("Error fetching escalations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllEscalations = async (req, res) => {
  try {
    const escalations = await escalationModel.find().sort({ createdAt: -1 });
    res.status(200).json({ escalations, success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch escalations", success: false });
  }
};

// READ - Get Escalation by ID
exports.getEscalationById = async (req, res) => {
  try {
    const { id } = req.params;
    const escalation = await escalationModel.findById(id);
    if (!escalation) {
      return res.status(404).json({ message: "Escalation not found", success: false });
    }
    res.status(200).json({ escalation, success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch escalation", success: false });
  }
};
 

// UPDATE Escalation
exports.updateEscalation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.audio = req.file.path;
    }

    const updated = await escalationModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Escalation not found", success: false });
    }

    res.status(200).json({ updated, message: "Escalation updated", success: true });
  } catch (error) {
    res.status(500).json({ message: "Update failed", success: false });
  }
};


// DELETE Escalation
exports.deleteEscalation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await escalationModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Escalation not found", success: false });
    }

    // Optionally remove reference from user
    await userModel.updateMany(
      { escalationdetail: id },
      { $pull: { escalationdetail: id } }
    );

    res.status(200).json({ message: "Escalation deleted", success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", success: false });
  }
};