// models/Evaluation.js
const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    useremail: {
      type: String,
      required: [true, "field is require"],
    },
    leadID: {
      type: String,
      required: [true, "field is require"],
    },
    agentName: {
      type: String,
      required: [true, "field is require"],
    },
    mod: {
      type: String,
      required: [true, "field is require"],
    },
    teamleader: {
      type: String,
      required: [true, "field is require"],
    },
    responsetime: {
      type: String,
      required: [true, "field is required"],
    },
    greetings: {
      type: [String], 
      default: [],
      validate: {
        validator: function(arr) {
          return arr.length <= 3 && 
                 (arr.length === 0 || 
                  (arr.length >= 1 && typeof arr[0] === 'string') &&
                  (arr.length < 2 || typeof arr[1] === 'string') &&
                  (arr.length < 3 || typeof arr[2] === 'string'));
        },
        message: "Greetings must be an array of strings (max 3 elements)"
      }
    },
    accuracy: String,
    building: String,
    presenting: String,
    closing: String,
    bonus: String,
    evaluationsummary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);