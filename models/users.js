const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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
  { timestamps: true }
);

// autoIncrement.initialize(mongoose.connection);
// UserSchema.plugin(autoIncrement.plugin, "User");

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
