import Moralis from 'moralis';
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

// Initialize Moralis
const address = '0xE1191Ed4C4A07BB8F11424ED74e42A1d5514c99a'
const initializeMoralis = async () => {
    await Moralis.start({
      apiKey: "Atpk2d9hb4PRXtr66UHFNf8Y0O3dNNQkphovFp2ZrNERei8cVYtdQKeDzK5Vu6B3"
    });
  };
 // Function to fetch token price from API
async function getTokenPrice(address) {
    initializeMoralis()
    const response = await Moralis.EvmApi.token.getTokenPrice({
      "chain": "0x1",
      "include": "percent_change",
      "address": address 
    });
  
    return response.raw;
  }
  
  // Function to calculate market cap
  async function getMarketCap(address) {
    // Fetch token price from API
    const tokenPriceData = await getTokenPrice(address);
    const tokenPriceUSD = Number(tokenPriceData.usdPrice);
    console.log(tokenPriceUSD);
    
    // Fetch circulating supply and other data
    const res = await Router.getAmountsOut(parseEther("1"), [
      WETH,
      address,
    ]);
  
    const decimal = await ERC20.attach(address).decimals();
    const totalSupply = await ERC20.attach(address).totalSupply();
    const burn = await ERC20.attach(address).balanceOf('0x000000000000000000000000000000000000dEaD');
    const circulatingSupply = Number(totalSupply) - Number(burn);
    console.log(circulatingSupply);
    
    const realCirculatingSupply =  BigInt(circulatingSupply) / (BigInt(10) ** BigInt(decimal));
    const marketcap = Number(tokenPriceUSD) * Number(realCirculatingSupply);
    console.log('marketCap', marketcap);
    return marketcap;
  }


export { getMarketCap };