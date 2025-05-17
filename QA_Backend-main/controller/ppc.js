const Ppc = require('../model/Ppc');
const userModel = require("../model/user");

exports.ppc = async (req, res) => {
  try {
    
    const { leadId, mod, source, teamleader, leadQuality } = req.body;

    if (!leadId || !mod || !source || !teamleader) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ppcData = {
      owner: req.user._id,
      userLeadId: leadId,
      mod,
      source,
      teamleader,
      leadQuality
    };

    const ppcResponse = await new Ppc(ppcData).save();

    await userModel.findByIdAndUpdate(req.user._id, { $push: { ppc: ppcResponse._id } });

    res.status(202).json({ ppcResponse, message: "Created!", success: true });

  } catch (error) {
    console.error('❌ Error while creating PPC:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
