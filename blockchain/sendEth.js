import { Wallet, ethers, parseEther, parseUnits } from "ethers";
import { Provider, v2Pair } from "./config.js";
import { getAmountsOut } from "./utils.js";
import { swapToken } from "./sniper.js";
console.log((await Provider.getNetwork()).chainId);
// console.log(Date.getTime());
process.exit();
// const senderAddress =
//   "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6";
// const to = "0x4F306C3eE0b9A0dD123523870D5fd08e7a29e42C";
// const sender = new Wallet(senderAddress, Provider);
// const trx = {
//   to,
//   value: parseEther("2"),
//   gasPrice: Provider.provider.gasPrice,
//   nonce: await Provider.getTransactionCount(sender.address),
// };
// console.log("Sending ETH");
// console.log(await sender.sendTransaction(trx));
// console.log("SEnT");
const tokenIn = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const tokenOut = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const key =
  "0x1e33ca5157c4bbb6556548b1b9283b47d4720f04b25cf4bb0e7bf06a42717769";
const amountIn = "0.0000001";

let amtin = parseUnits(amountIn, 18);
const out = await getAmountsOut(amtin, tokenIn, tokenOut);
const swapRes = await swapToken(tokenIn, amtin, tokenOut, key);
