const Evaluation = require('../model/Evaluation');
const EvaluationRating = require('../model/rating');
const User = require('../model/user'); // Assuming you have a User model

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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Process greetings data
    let greetings = [];
    if (req.body.greetings) {
      greetings = Array.isArray(req.body.greetings) 
        ? req.body.greetings.filter(g => typeof g === 'string')
        : [req.body.greetings];
    }

    // Create evaluation
    const evaluation = new Evaluation({
      owner: req.user._id,
      useremail: user.email,
      leadID: req.body.leadId,
      agentName: req.body.agentName,
      mod: req.body.mod,
      teamleader: req.body.teamleader,
      responsetime: req.body.responsetime,
      greetings: greetings,
      accuracy: req.body.accuracy,
      building: req.body.building,
      presenting: req.body.presenting,
      closing: req.body.closing,
      bonus: req.body.bonus,
      evaluationsummary: req.body.evaluationsummary,
      createdAt: utcDate,
    });

    await evaluation.save();

    // Create evaluation rating
    const evaluationRate = new EvaluationRating({
      owner: req.user._id,
      evaluatedRating: evaluation._id,
      rating: req.body.rating,
    });
    await evaluationRate.save();

    // Update user references
    await User.findByIdAndUpdate(req.user._id, {
      $push: { 
        evaluationdetail: evaluation._id,
        evaluationRating: evaluationRate._id 
      }
    });

    res.status(201).json({ 
      evaluation, 
      evaluationRating: evaluationRate,
      message: "Evaluation created successfully!", 
      success: true 
    });

  } catch (error) {
    console.error("Error creating evaluation:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message,
      success: false
    });
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
