const userModel = require("../model/user");
const marketingModel = require("../model/Marketing");

exports.marketing = async (req, res) => {
    try {
        const marketingDate = new Date();
        const utcDate = new Date(
            Date.UTC(
                marketingDate.getFullYear(),
                marketingDate.getMonth(),
                marketingDate.getDate()
            )
        );
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const data = {
            owner: req.user._id,
            leadID: req.body.leadId,
            teamleader: req.body.teamleader,
            branch: req.body.branch,
            source: req.body.source,
            leadQuality: req.body.leadQuality,
            createdAt: utcDate,
        };
        const marketing = new marketingModel(data);
        await marketing.save();

        await userModel.findByIdAndUpdate(req.user._id, {
            $push: { evaluationdetail: marketing._id },  
        });

        return res.status(201).json({ message: "Marketing data saved successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};