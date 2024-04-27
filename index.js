const { default: BigNumber } = require('bignumber.js');
const rp = require('request-promise');
const { mainAction } = require('./actions/main-action');
const { EthAccount } = require('./components/account');
const { web3ScrollList } = require('./components/web3-scroll');
const { proxies } = require('./proxies');
const {
  SLEEP_MAX_ACC_MS, SLEEP_MIN_ACC_MS,
} = require('./settings');
const { getRandomInt } = require('./utils/getRandomInt');
const { logger } = require('./utils/logger');
const { sleep } = require('./utils/sleep');
const WALLETS = require('./wallets');

async function start() {
  for (const { PRIVATE_KEY, DEPOSIT_OKX_ADDRESS } of WALLETS) {
    await mainAction(PRIVATE_KEY, DEPOSIT_OKX_ADDRESS);

    const sleepMs = getRandomInt(SLEEP_MIN_ACC_MS, SLEEP_MAX_ACC_MS);

    logger.info('sleep', {
      ms: sleepMs,
    });

    await sleep(sleepMs);

    try {
      // const proxy = proxies.get();
      // if (proxy?.linkToChange) {
      //   await rp(proxy.linkToChange);
      //   logger.info('Changed proxy ip');
      // }
    } catch (exc) {
      logger.error('Error change proxy', exc);
    }
  }
}

start();
