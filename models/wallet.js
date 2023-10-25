import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  address: {
    required: true,
    type: String,
  },
  privateKey: {
    required: true,
    type: String,
  },

  owner: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
});

export default mongoose.model("Wallet", walletSchema);
