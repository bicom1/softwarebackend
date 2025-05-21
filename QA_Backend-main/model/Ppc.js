import { Schema, model } from "mongoose";

const Ppc = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
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

export default model('Ppc', Ppc);
