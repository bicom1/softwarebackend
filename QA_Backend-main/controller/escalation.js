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
