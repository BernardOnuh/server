import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  Contract,
  WebSocketProvider,
  ZeroAddress,
  formatUnits,
  parseEther,
} from "ethers";
import { WETH, factoryAddress, routerAddress } from "./addresses.js";
import { zeroAddress } from "viem";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const factoryAbi = JSON.parse(fs.readFileSync(__dirname + "/factoryAbi.json"));
const routerAbi = JSON.parse(fs.readFileSync(__dirname + "/routerAbi.json"));
const erc20Abi = JSON.parse(fs.readFileSync(__dirname + "/erc20Abi.json"));
const pairAbi = JSON.parse(fs.readFileSync(__dirname + "/pairAbi.json"));
const URL = "wss://mainnet.infura.io/ws/v3/c1c0abab0f8e47d6abe2496ea0aae09d";

export const Provider = new WebSocketProvider(URL);
export const chainId = (await Provider.getNetwork()).chainId;
export const Factory = new Contract(factoryAddress, factoryAbi, Provider);
export const Router = new Contract(routerAddress, routerAbi, Provider);
export const ERC20 = new Contract(ZeroAddress, erc20Abi, Provider);
export const v2Pair = new Contract(zeroAddress, pairAbi, Provider);

const address = '0xE1191Ed4C4A07BB8F11424ED74e42A1d5514c99a';
 const res = await Router.getAmountsOut(parseEther("1"), [
   WETH,
   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
 ]);

 const decimal = await ERC20.attach(
   address
 ).decimals();

 const token = await Router.getAmountsOut(parseEther("1"), [
  WETH,
  address,
]);

 console.log(decimal);
 console.log(formatUnits(res[1], 6));
 const EthPrice = formatUnits(res[1], 6);
 console.log('price in ETH',EthPrice)
 const tokenPrice = formatUnits(token[1], (Number(decimal) + Number(6)));                                 
  console.log('token price',tokenPrice)
const tokenPriceUSD =  Number(tokenPrice) * Number(EthPrice)
console.log('token price in USD',tokenPriceUSD)
 const totalSupply = await ERC20.attach(address).totalSupply();
 console.log(totalSupply)
 const burn = await ERC20.attach(address).balanceOf('0x000000000000000000000000000000000000dEaD');
 const circulatingSupply = (Number(totalSupply) - Number(burn));
 console.log("Circulating:",circulatingSupply)
 const realCirculatingSupply = BigInt(circulatingSupply) / (BigInt(10) ** BigInt(decimal));
 console.log("Circulating Supply:", realCirculatingSupply);
 
 const marketcap = Number(tokenPriceUSD) * Number(realCirculatingSupply);
console.log(marketcap)
