import { parseUnits } from "ethers";
import { getAmountsOut, getDecimals } from "../blockchain/utils.js";
import { swapToken } from "../blockchain/sniper.js";
import Wallet from "../models/wallet.js";
import Transaction from "../models/transaction.js";
import Token from "../models/token.js";
import { Provider, chainId } from "../blockchain/config.js";

const buyToken = async (req, res) => {
  console.log(req.body);
};

const sellToken = async (req, res) => {};

const snipeToken = async (req, res) => {
  const user = req.session?.user;

  if (!user) {
    res.status(401).send("Login required");
    return;
  }

  const owner = user;

  const userWallet = await Wallet.findOne({
    owner: user,
  });

  const { wallet, slippage, gasDelta, tip, tokenIn, tokenOut, amountIn } =
    req.body;
  const inDecimals = await getDecimals(tokenIn);
  let amtin = parseUnits(amountIn, inDecimals);

  const out = await getAmountsOut(amtin, tokenIn, tokenOut);
  const swapRes = await swapToken(
    tokenIn,
    amtin,
    tokenOut,
    userWallet.privateKey
  );

  const newTrx = new Transaction({
    sender: owner,
    hash: swapRes.hash,
    chainId: Number(chainId),
    token: tokenIn,
    type: "snipe",
    side: "buy",
    amountIn: Number(amountIn),
    tokenAmount: Number(out),
  });

  let tkExist = await Token.findOne({
    chainId: Number(chainId),
    address: tokenOut,
    owner: owner,
  });

  if (!tkExist) {
    console.log("Token does not exist");
    const newToken = new Token({
      owner: owner,
      chainId: Number(chainId),
      address: tokenOut,
      initialPrice: 1,
      initialAmount: Number(out),
    });
    tkExist = await newToken.save();
  }
  await newTrx.save();
  res.status(200).json({ trx: newTrx, token: tkExist });
};

const buylimitOrder = async (req, res) => {
  // Parse request data, including WalletAddress, ContractAddress, marketCapThreshold, and amount
  const { WalletAddress,chainId, ContractAddress, marketCap, amount } = req.body;

  // Create the buy order without validation
  const order = {
    WalletAddress,
    chainId,
    ContractAddress,
    marketCap,
    amount,
    orderStatus: "pending", // Set the default status to "pending"
  };

  try {
    // Create a new Token document without validation
    const token = new Token({ WalletAddress: WalletAddress });

    // Push the order into the buyOrders array
    token.buyOrders.push(order);

    // Save the document without validation
    await token.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Buy order created successfully.", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating buy order." });
  }
};


const selllimitOrder = async (req, res) => {
  // Parse request data, including marketCapThreshold and amount
  const {address, marketCapThreshold, amount } = req.body;
  
  // Get the user's wallet address (user) from the session
  const user = req.session?.user;

  // Create the sell order in the token model
  try {
    const order = {
      address,
      marketCapThreshold,
      amount,
      orderStatus: "pending", // Set the default status to "pending"
    };

    // Find the token by owner and create a sell order
    const token = await Token.findOne({ owner: user });
    if (!token) {
      res.status(404).json({ message: "Token not found for the user." });
      return;
    }

    token.sellOrders.push(order);

    await token.save();

    res.status(201).json({ message: "Sell order created successfully.", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating sell order." });
  }
};

const getAllBuyLimitOrders = async (req, res) => {
  try {
    // Find all tokens with buy limit orders
    const tokensWithBuyOrders = await Token.find({
      "buyOrders.0": { $exists: true },
    });

    // Extract all buy orders
    const allBuyOrders = tokensWithBuyOrders.reduce(
      (orders, token) => orders.concat(token.buyOrders),
      []
    );

    res.status(200).json(allBuyOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching all buy limit orders." });
  }
};

const getAllSellLimitOrders = async (req, res) => {
  try {
    // Find all tokens with sell limit orders
    const tokensWithSellOrders = await Token.find({
      "sellOrders.0": { $exists: true },
    });

    // Extract all sell orders
    const allSellOrders = tokensWithSellOrders.reduce(
      (orders, token) => orders.concat(token.sellOrders),
      []
    );

    res.status(200).json(allSellOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching all sell limit orders." });
  }
};

export default {
  sellToken,
  buyToken,
  snipeToken,
  selllimitOrder,
  buylimitOrder,
  getAllBuyLimitOrders,
  getAllSellLimitOrders,
};


