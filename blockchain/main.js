import { Factory } from "./config.js";

Factory.on("PairCreated", (token0, token1, pair) => {
  console.log(token0);
  console.log(token1);
  console.log(pair);
});
