const { default: BigNumber } = require('bignumber.js');
const ABI_MERKLE_HYPERLANE = require('../data/abi-merkle-hyperlane.json');
const { MERKLE_HYPERLANE } = require('../constants/constants');
const { logger } = require('../utils/logger');
const { retry } = require('../utils/retry');

class MerkleHyperlane {
  constructor(web3, ethAccount) {
    this.ethAccount = ethAccount;
    this.web3 = web3;
  }

  async doBridge(fromChain, toChain, amountInWei) {
    return await retry(async () => {
      const sourceChain = MERKLE_HYPERLANE.find((chain) => chain.name.toUpperCase() === fromChain.toUpperCase());
      const distChain = MERKLE_HYPERLANE.find((chain) => chain.name.toUpperCase() === toChain.toUpperCase());

      const contractFrom = new this.web3.eth.Contract(ABI_MERKLE_HYPERLANE, sourceChain.hyperlane.token);

      const method = contractFrom.methods.bridgeETH(distChain.chainId, amountInWei);

      const { gasPrice } = await this.ethAccount.getGasPrice();

      const quote = await contractFrom.methods.quoteBridge(distChain.chainId, amountInWei).call();

      const estimateGas = await method.estimateGas({
        from: this.ethAccount.address,
        value: new BigNumber(amountInWei).plus(quote).toString(),
        gasPrice,
      });

      logger.info('Estimate gas Merkle Hyperlane', {
        estimateGas,
      });

      if (estimateGas) {
        const data = method.encodeABI();

        const response = await this.ethAccount.finalizeTransaction({
          from: this.ethAccount.address,
          to: contractFrom.options.address,
          value: new BigNumber(amountInWei).plus(quote).toString(),
          gasPrice,
          data,
          gas: new BigNumber(estimateGas).multipliedBy(1.2).toFixed(0),
        });

        logger.info('Merkle transaction sent', {
          hash: response.transactionHash,
        });
      }
    }, 3, 15000);
  }
}

module.exports = {
  MerkleHyperlane,
};
