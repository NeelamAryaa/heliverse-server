const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    team_name: {
      type: String,
      required: true,
      unique: true,
    },
    selected_user: {
      type: [
        {
          first_name: {
            type: String,
            required: true,
          },
          last_name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
          gender: {
            type: String,
            required: true,
          },
          domain: {
            type: String,
            required: true,
          },
          avatar: {
            type: String,
            required: true,
          },
          available: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const TeamModel = mongoose.model("Team", TeamSchema);

module.exports = TeamModel;
