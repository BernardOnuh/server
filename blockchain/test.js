import { getMarketCap } from './getMarketCap.js'; // Replace 'yourModule.js' with the actual path to your module file

// Now you can use the getMarketCap function
//const tokenAddress = '0xE1191Ed4C4A07BB8F11424ED74e42A1d5514c99a';
//const marketCap = getMarketCap(tokenAddress);

//console.log('Market Cap:', marketCap);

import axios from 'axios';

const apiUrl = 'http://localhost:3001/order/buy-limit-order/'; // Replace with your actual API endpoint

axios.get(apiUrl)
  .then(async response => {
    if (response.status === 200) {
      const buyOrders = response.data; // Assuming the response is an array of buy orders
console.log(buyOrders)
      for (const order of buyOrders) {
        const { ContractAddress } = order;
        try {
          const marketCap = await getMarketCap(ContractAddress);
          console.log(`Contract Address: ${ContractAddress} Market Cap: ${marketCap}`);
        } catch (error) {
          console.error('Error fetching market cap:', error);
        }
      }
    } else {
      console.log('Failed to fetch data from the API.');
    }
  })
  .catch(error => {
    console.error('An error occurred while making the API request:', error);
  });
