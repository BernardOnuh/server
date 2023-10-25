import { Wallet } from "ethers";
import { Provider, Router, ERC20 } from "./config.js";

export const generateWallet = () => {
  const wallet = Wallet.createRandom();
  return { address: wallet.address, key: wallet.privateKey };
};

export const getAmountsOut = async (amountIn, tokenIn, tokenOut) => {
  const res = await Router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
  return res[1];
};

export const getDecimals = async (tokenAddress) => {
  const token = ERC20.attach(tokenAddress);
  return await token.decimals();
};

export const getBalance = async (tokenAddress, owner) => {
  const token = ERC20.attach(tokenAddress, owner);
  return await token.balanceOf(owner);
};
