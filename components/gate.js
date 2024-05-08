const ccxt = require('ccxt');
const fs = require('fs');
const { API_GATE, API_GATE_SECRET } = require('../secret');
const { logger } = require('../utils/logger');
// const { logger } = require('../utils/logger');

const exchange = new ccxt.gateio({
  apiKey: API_GATE,
  secret: API_GATE_SECRET,
  enableRateLimit: true,
});

async function getGateTokenBalance(token) {
  const balance = await exchange.fetchBalance();
  return balance.free[token] || 0;
}

async function withdrawTokenGate(address, amount, token, network) {
  try {
    const tag = ''; // Указываем tag, если это необходимо для вашего токена и сети

    const currencies = await exchange.fetchCurrencies();

    fs.writeFileSync('./networks-gate.json', JSON.stringify(currencies, null, 2));

    const networkInfo = currencies[token].networks[network]; // Детали сети

    const withdrawal = await exchange.withdraw(token, amount, address, tag, {
      network,
      // fee: networkInfo.fee,
    });

    logger.info('Response withdraw', withdrawal);

    return withdrawal;
  } catch (error) {
    logger.error('Error withdraw', error);
  }
}

// async function transferFromSubToMaster(currency) {
//   const { info } = await exchange.fetchBalance();

//   for (const subaccount in info) {
//     if (info.hasOwnProperty(subaccount)) {
//       const balances = info[subaccount];
//       if (balances[currency] && balances[currency] > 0) {
//         const response = await exchange.transfer(currency, balances[currency], 'main', subaccount);
//         logger.info('Transfer response', {
//           subaccount,
//           response,
//         });
//       }
//     }
//   }
// }

module.exports = {
  withdrawTokenGate,
  getGateTokenBalance,
//   transferFromSubToMaster,
};
