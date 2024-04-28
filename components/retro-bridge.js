const rp = require('request-promise');
const { RETROBRIDGE_NETOWRKS } = require('../constants/constants');
const { logger } = require('../utils/logger');
const { retry } = require('../utils/retry');

class RetroBridge {
  constructor(web3, ethAccount, proxy) {
    this.web3 = web3;
    this.proxy = proxy;
    this.ethAccount = ethAccount;

    this.request = rp.defaults({
      json: true,
      gzip: true,
      proxy: this.proxy,
      jar: rp.jar(),
    });
  }

  async getCurrencies(networkFromId, netoworkToId) {
    const { data } = await this.request({
      url: 'https://backend.retrobridge.io/api/currency',
      qs: {
        network_from_id: networkFromId,
        network_to_id: netoworkToId,
      },
    });

    return data;
  }

  async createOrder(amount, currency_in_id, currency_out_id, wallet_receiver, wallet_sender) {
    return await retry(async () => {
      const { data } = await this.request({
        url: 'https://backend.retrobridge.io/api/orders',
        method: 'POST',
        body: {
          amount: `${amount}`,
          currency_in_id,
          currency_out_id,
          wallet_receiver,
          wallet_sender,
        },
        headers: {
          'Network-Type': 'EVM',
        },
      });

      return data;
    }, 40, 15000);
  }

  async getPair(currencyInId, networkToId) {
    const { data } = await this.request(`https://backend.retrobridge.io/api/currency/${currencyInId}/pairs?network_to_id=${networkToId}`);

    return data.data[0];
  }

  async getReceiver(currencyInId, currencyOutId) {
    const { data } = await this.request({
      url: 'https://backend.retrobridge.io/api/orders/receiver',
      qs: {
        currency_in_id: currencyInId,
        currency_out_id: currencyOutId,
      },
    });

    return data.wallet;
  }

  async getAuthData(sender) {
    const { data } = await this.request('https://backend.retrobridge.io/api/wallet_auth/message');

    const { message } = data;
    const msgToSign = `${message.value}\n${sender}`;

    const { signature } = await this.ethAccount.signMessage(msgToSign);

    const response = await this.request({
      url: 'https://backend.retrobridge.io/api/wallet_auth/message',
      method: 'POST',
      body: {
        network_type: 'EVM',
        signature,
        wallet_address: sender,
      },
    });

    if (response.message === 'Success') {
      logger.info('Success auth', {
        sender,
      });
    }
  }

  async doBridge(fromChain, toChain, value, ccy, sender) {
    return await retry(async () => {
      const fromChainId = RETROBRIDGE_NETOWRKS.find((network) => network.name.toUpperCase() === fromChain.toUpperCase()).id;
      const toChainId = RETROBRIDGE_NETOWRKS.find((network) => network.name.toUpperCase() === toChain.toUpperCase()).id;

      await this.getAuthData(sender);
      const currencies = await this.getCurrencies(fromChainId, toChainId);

      const currencyIn = currencies.find((c) => c.symbol === ccy);
      const currencyOut = await this.getPair(currencyIn.id, toChainId);

      const currencyInId = currencyIn.id;
      const currencyOutId = currencyOut.id;

      const walletReceiver = await this.getReceiver(currencyInId, currencyOutId);

      const order = await this.createOrder(value, currencyInId, currencyOutId, sender, sender);

      if (order) {
        logger.info('Success create order', {
          order,
        });

        const { gasPrice } = await this.ethAccount.getGasPrice();

        const data = await this.ethAccount.finalizeTransaction({
          from: this.ethAccount.address,
          to: walletReceiver,
          value: value * 1e18,
          gasPrice,
          gas: 300_000,
        });

        logger.info('Sent transaction', {
          hash: data.transactionHash,
        });

        return order.amount_out;
      }
    }, 3, 14000);
  }
}

module.exports = {
  RetroBridge,
};
