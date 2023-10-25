import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  sender: {
    required: true,
    type: String,
  },

  hash: {
    required: true,
    type: String,
  },

  chainId: {
    required: true,
    type: Number,
  },

  token: {
    required: true,
    type: String,
  },

  type: {
    required: true,
    type: String,
  },

  side: {
    required: true,
    type: String,
  },

  amountIn: {
    required: true,
    type: Number,
  },

  tokenAmount: {
    required: true,
    type: Number,
  },

  timestamp: {
    type: Number,
    default: function () {
      return new Date().getTime();
    },
  },
});
const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
