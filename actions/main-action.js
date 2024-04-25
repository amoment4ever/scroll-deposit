const { default: BigNumber } = require('bignumber.js');
const { EthAccount } = require('../components/account');
const { MerkleHyperlane } = require('../components/merkle-hyperlane');
const { withdrawToken } = require('../components/okx');
const { RetroBridge } = require('../components/retro-bridge');
const { ScrollBridge } = require('../components/scroll-bridge-main');
const { web3sBaseList } = require('../components/web3-base');
const { web3Eth } = require('../components/web3-eth');
const { web3sOptimismList } = require('../components/web3-optimism');
const { web3ScrollList } = require('../components/web3-scroll');
const { web3ZksyncList } = require('../components/web3-zksync');

const {
  SLEEP_MIN_MS, SLEEP_MAX_MS, MIN_AMOUNT_ETH, MAX_AMOUNT_ETH,
} = require('../settings');
const { randomNumber, getRandomInt, sampleFromArray } = require('../utils/getRandomInt');
const { logger } = require('../utils/logger');
const { retry } = require('../utils/retry');
const { sleep } = require('../utils/sleep');
const { waitForEthBalance, waitForOkxBalance, waitForLowerGasPrice } = require('../utils/wait-for');
const { transferAction } = require('./transferAction');

async function sleepWithLog() {
  const sleepMs = getRandomInt(SLEEP_MIN_MS, SLEEP_MAX_MS);

  logger.info('Sleep', {
    sleepMs,
  });

  await sleep(sleepMs);
}

async function withdrawFromOkx(AMOUNT_ETH, ethAccount, SOURCE_CHAIN, sourceWeb3) {
  logger.info('Withdraw ETH from OKX', {
    amount: AMOUNT_ETH,
  });
  await waitForOkxBalance(AMOUNT_ETH, 'ETH');

  await withdrawToken(ethAccount.address, AMOUNT_ETH, 'ETH', SOURCE_CHAIN);

  logger.info('Wait for ETH on balance', {
    expect: AMOUNT_ETH * 0.95,
  });
  await waitForEthBalance(sourceWeb3, AMOUNT_ETH * 0.95, ethAccount.address);
}

function getFristChain() {
  return 'zkSync Era';
  // const firtChain = sampleFromArray(['Optimism', 'Base', 'zkSync Era']);

  // return firtChain;
}

function getLastChain() {
  return sampleFromArray(['Optimism', 'Base']);
}

async function mainAction(privateKey, depositOkxAddress) {
  const AMOUNT_ETH = +randomNumber(MIN_AMOUNT_ETH, MAX_AMOUNT_ETH).toFixed(5);

  const chainData = {
    Optimism: {
      web3List: web3sOptimismList,
    },
    Base: {
      web3List: web3sBaseList,
    },
    'zkSync Era': {
      web3List: web3ZksyncList,
    },
  };

  const firstChain = getFristChain();

  logger.info('Withdraw from okx to', {
    firstChain,
    AMOUNT_ETH,
  });

  const { web3List } = chainData[firstChain];
  const { web3: web3FristChain, scan: scanFirstChain, proxy: proxyFirstChain } = web3List.get();
  const firstChainEthAccount = new EthAccount(privateKey, web3FristChain, proxyFirstChain, scanFirstChain);

  const beforeWithdraw = await firstChainEthAccount.getBalance();

  await withdrawFromOkx(AMOUNT_ETH, firstChainEthAccount, firstChain, web3FristChain);

  const afterWithdraw = await firstChainEthAccount.getBalance();

  const bridgeAmountRetroBridge = new BigNumber(afterWithdraw).minus(beforeWithdraw).div(1e18).minus(0.0002);
  logger.info('Bridge amount retrobridge', {
    bridgeAmountRetroBridge: bridgeAmountRetroBridge.toString(),
  });

  const retroBridge = new RetroBridge(web3FristChain, firstChainEthAccount, proxyFirstChain.proxy);

  await waitForLowerGasPrice();
  const recieveAfterBridge = await retroBridge.doBridge(firstChain, 'Ethereum', bridgeAmountRetroBridge.toString(), 'ETH', firstChainEthAccount.address);
  // todo send eth to receiver

  await waitForEthBalance(web3Eth, recieveAfterBridge, firstChainEthAccount.address);

  // const recieveAfterBridge = 0.0119595;
  const depositScrollAmount = new BigNumber(recieveAfterBridge).minus(0.001);

  const ethAccountETH = new EthAccount(privateKey, web3Eth);
  const scrollBridge = new ScrollBridge(web3Eth, ethAccountETH);

  await waitForLowerGasPrice();
  await scrollBridge.deposit(depositScrollAmount.multipliedBy(1e18).toString());

  const { web3: web3Scroll, scan: scanScroll, proxy: proxyScroll } = web3ScrollList.get();

  await waitForEthBalance(web3Scroll, depositScrollAmount.toString(), ethAccountETH.address);

  const ethAccountScroll = new EthAccount(privateKey, web3Scroll, proxyScroll, scanScroll);

  const merkleHyperlane = new MerkleHyperlane(web3Scroll, ethAccountScroll);

  const lastChain = getLastChain();

  logger.info('Last chain', {
    lastChain,
  });

  const { web3List: web3ListLastChain } = chainData[lastChain];
  const { web3: web3LastChain, scan: scanLastChain, proxy: proxyLastChain } = web3ListLastChain.get();
  const lastChainEthAccount = new EthAccount(privateKey, web3LastChain, proxyLastChain, scanLastChain);

  await merkleHyperlane.doBridge('SCROLL', lastChain, depositScrollAmount.multipliedBy(1e18).div(2).toFixed(0));
  await sleepWithLog(15000);
  await merkleHyperlane.doBridge('SCROLL', lastChain, depositScrollAmount.multipliedBy(1e18).div(2).toFixed(0));

  await waitForEthBalance(web3LastChain, recieveAfterBridge - 0.001, lastChainEthAccount.address);

  logger.info('Transfer ETH to OKX', {
    address: lastChainEthAccount.address,
    depositOkxAddress,
    chain: lastChain,
  });

  await retry(async () => {
    await transferAction(lastChainEthAccount, lastChainEthAccount.address, depositOkxAddress, lastChain);
  }, 5, 10000);
}

module.exports = {
  mainAction,
};
