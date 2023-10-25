import { Wallet, getAddress, parseEther } from "ethers";
import { Provider, Router } from "./config.js";
import { WETH } from "./addresses.js";

export const swapToken = async (tokenIn, amountIn, tokenOut, signer) => {
  const wallet = new Wallet(signer, Provider);
  const userRouter = Router.connect(wallet);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  console.log(deadline);
  let res;
  if (getAddress(tokenIn) === WETH) {
    // Swap ETH for TOKEN
    console.log("Swapping ETH for token");
    res = await userRouter.swapExactETHForTokensSupportingFeeOnTransferTokens(
      0,
      [tokenIn, tokenOut],
      wallet.address,
      deadline,
      { value: amountIn }
    );
  } else if (getAddress(tokenOut) === WETH) {
    // Swap TOKEN FOR ETH
    res = await userRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
      amountIn,
      0,
      [tokenOut, WETH],
      wallet.address,
      deadline
    );
  } else {
    // Swap TOKENS for TOKENS
    res =
      await userRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn,
        0,
        [tokenIn, tokenOut],
        wallet.address,
        deadline
      );
  }

  const trx = await Provider.waitForTransaction(res.hash);
  return trx;
};
