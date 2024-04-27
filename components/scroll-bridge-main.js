const { default: BigNumber } = require('bignumber.js');
const { BRIDGE_CONTRACTS } = require('../constants/constants');
const DEPOSIT_ABI = require('../data/abi-deposit-bridge.json');
const ORACLE_ABI = require('../data/abi-oracle-bridge.json');
const { logger } = require('../utils/logger');
const { retry } = require('../utils/retry');

class ScrollBridge {
  constructor(web3, ethAccount) {
    this.web3 = web3;
    this.ethAccount = ethAccount;

    this.depositContract = new web3.eth.Contract(DEPOSIT_ABI, BRIDGE_CONTRACTS.DEPOSIT);
    this.oracleContract = new web3.eth.Contract(ORACLE_ABI, BRIDGE_CONTRACTS.ORACLE);
  }

  async deposit(amountInWei) {
    return await retry(async () => {
      const GAS_LIMIT = 168000;
      const fee = await this.oracleContract.methods.estimateCrossDomainMessageFee(GAS_LIMIT).call();
      const total = new BigNumber(amountInWei).plus(fee).toString();

      const method = this.depositContract.methods.sendMessage(this.ethAccount.address, amountInWei, '0x', GAS_LIMIT);

      const { gasPrice } = await this.ethAccount.getGasPrice();

      const estimateGas = await method.estimateGas({
        from: this.ethAccount.address,
        gasPrice,
        value: total,
      });

      logger.info('EstimateGas Deposit Scroll', { estimateGas });

      if (estimateGas) {
        const encodedData = method.encodeABI();

        const response = await this.ethAccount.finalizeTransaction({
          from: this.ethAccount.address,
          to: this.depositContract.options.address,
          maxFeePerGas: gasPrice + 1e9,
          maxPriorityFeePerGas: 0.01e9,
          value: total,
          data: encodedData,
          gas: new BigNumber(estimateGas).multipliedBy(1.2).toFixed(0),
        });

        logger.info('Sent transaction', {
          hash: response.transactionHash,
        });
      }
    }, 3, 15000);
  }
}

module.exports = {
  ScrollBridge,
};
