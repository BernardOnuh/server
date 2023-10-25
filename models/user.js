import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  address: {
    required: true,
    unique: true,
    type: String,
  },

  username: {
    type: String,
    default: function () {
      return this.address;
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
