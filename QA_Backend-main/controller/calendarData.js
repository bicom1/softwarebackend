const Escalation = require("../model/Escalation");
const Evaluation = require("../model/Evaluation");
const Marketing = require("../model/Marketing");

exports.getCalendarFilterDataEscalation = async (req, res) => {
  try {
    const { startDate, endDate, agentName, teamleader } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required.",
      });
    }

    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (isNaN(formattedStartDate.getTime()) || isNaN(formattedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    const query = {
      createdAt: {
        $gte: new Date(formattedStartDate.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(formattedEndDate.setUTCHours(23, 59, 59, 999)),
      },
    };

    if (teamleader && teamleader.trim() !== "") {
      query.teamleader = { $regex: new RegExp(teamleader, "i") };
    }

  
    if (agentName && agentName.trim() !== "") {
      query.agentName = { $regex: new RegExp(agentName, "i") };
    }

   

    const filteredData = await Escalation.find(query);

    if (!filteredData || filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the selected date range.",
      });
    }

    res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error in getCalendarFilterDataEscalation:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

exports.getCalendarFilterDataEvaluation = async (req, res) => {
  try {
    const { startDate, endDate, agentName,  teamleader} = req.query;

    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required.",
      });
    }

    
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (isNaN(formattedStartDate.getTime()) || isNaN(formattedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    const query = {
      createdAt: {
        $gte: new Date(formattedStartDate.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(formattedEndDate.setUTCHours(23, 59, 59, 999)),
      },
    };

    if (teamleader && teamleader.trim() !== "") {
      query.teamleader = { $regex: new RegExp(teamleader, "i") };
    }

  
    if (agentName && agentName.trim() !== "") {
      query.agentName = { $regex: new RegExp(agentName, "i") };
    }

   

    const filteredData = await Evaluation.find(query);


    if (!filteredData || filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the selected filters.",
      });
    }

    res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error in getCalendarFilterDataEvaluation:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};



exports.getcalendarfilterdatamarketing = async (req, res) => {
  try {
    const { startDate, endDate,branch, teamleader} = req.query;

    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Both startDate and endDate are required.",
      });
    }

    
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (isNaN(formattedStartDate.getTime()) || isNaN(formattedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }

    const query = {
      createdAt: {
        $gte: new Date(formattedStartDate.setUTCHours(0, 0, 0, 0)),
        $lt: new Date(formattedEndDate.setUTCHours(23, 59, 59, 999)),
      },
    };

    if (teamleader && teamleader.trim() !== "") {
      query.teamleader = { $regex: new RegExp(teamleader, "i") };
    }

  
    if (branch && branch.trim() !== "") {
      query.branch = { $regex: new RegExp(branch, "i") };
    }

   

    const filteredData = await Marketing.find(query);


    if (!filteredData || filteredData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for the selected filters.",
      });
    }

    res.status(200).json({
      success: true,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error in getcalendarfilterdatamarketing:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
