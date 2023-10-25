import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  owner: {
    required: true,
    type: String,
  },

  chainId: {
    required: true,
    type: Number,
  },

  address: {
    required: true,
    type: String,
  },

  initialPrice: {
    required: true,
    type: Number,
  },

  initialAmount: {
    required: true,
    type: Number,
  },

  buyOrders: [
    {
      WalletAddress : {
        required: true,
        type: String,
      },
      chainId: {
        required: true,
        type: Number,
      },
      ContractAddress: {
        required: true,
        type: String,
      },

      marketCap: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      orderStatus: {
        type: String,
        required: true,
        default: "pending", // Set the default order status to "pending"
      },
      // Add other properties relevant to buy orders, if needed.
    },
  ],
  
  sellOrders: [
    {
      address: {
        required: true,
        type: String,
      },
      
      marketCap: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      orderStatus: {
        type: String,
        required: true,
        default: "pending", // Set the default order status to "pending"
      },
      // Add other properties relevant to sell orders, if needed.
    },
  ],
});

const Token = mongoose.model("Token", tokenSchema);
export default Token;


           


