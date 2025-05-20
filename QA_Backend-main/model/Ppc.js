const mongoose = require("mongoose");

const Ppc = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userLeadId: {
        type: String,
        required: [true, "userLeadId is required"]
    },
    mod: {
        type: String,
        required: [true, "mod is required"]
    },
    source: {
        type: String,
        required: [true, "source is required"]
    },
    teamleader: {
        type: String,
        required: [true, "teamleader is required"]
    },
    leadQuality: {
        type: String
    },
    
});

module.exports = mongoose.model('Ppc', Ppc);
