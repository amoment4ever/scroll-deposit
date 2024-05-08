const { default: BigNumber } = require('bignumber.js');
const { EthAccount } = require('../components/account');
const { getGateTokenBalance, withdrawTokenGate } = require('../components/gate');
const { MerkleHyperlane } = require('../components/merkle-hyperlane');
const { withdrawToken, getTokenBalance } = require('../components/okx');
const { Orbiter } = require('../components/orbiter');
const { ScrollBridge } = require('../components/scroll-bridge-main');
const { web3sBaseList } = require('../components/web3-base');
const { web3Eth } = require('../components/web3-eth');
const { web3sOptimismList } = require('../components/web3-optimism');
const { web3ScrollList } = require('../components/web3-scroll');
const { web3ZksyncList } = require('../components/web3-zksync');

const {
  SLEEP_MIN_MS,
  SLEEP_MAX_MS,
  MIN_AMOUNT_ETH,
  MAX_AMOUNT_ETH,
  LEAVE_AMOUNT_ETHEREUM_MAX,
  LEAVE_AMOUNT_ETHEREUM_MIN,
  LEAVE_AMOUNT_SCROLL_MIN,
  DEPOSIT_GATE,
} = require('../settings');
const { randomNumber, getRandomInt, sampleFromArray } = require('../utils/getRandomInt');
const { logger } = require('../utils/logger');
const { retry } = require('../utils/retry');
const { sleep } = require('../utils/sleep');
const {
  waitForEthBalance, waitForOkxBalance, waitForLowerGasPrice, waitForGateBalance,
} = require('../utils/wait-for');
const { depositCogFinance, depositAaveAction, wrapUnwrapAction } = require('./landing-actions');
const { transferAction } = require('./transferAction');

async function sleepWithLog() {
  const sleepMs = getRandomInt(SLEEP_MIN_MS, SLEEP_MAX_MS);

  logger.info('Sleep', {
    sleepMs,
  });

  await sleep(sleepMs);
}

async function withdrawFromOkx(amountEth, address, chain) {
  logger.info('Withdraw ETH from OKX', {
    amount: amountEth,
  });

  await withdrawToken(address, amountEth, 'ETH', chain);
}

function getFristChain() {
  const firtChain = sampleFromArray(['Optimism', 'Base', 'zkSync Era']);

  return firtChain;
}

function getLastChain() {
  return sampleFromArray(['Optimism', 'Base']);
}

async function doBridgeOrbiter(ethAccount, web3, scan, proxy, bridgeAmount, fromChain, toChain) {
  const orbiter = new Orbiter(web3, proxy?.proxy);

  return await retry(async () => {
    const {
      _sendValue,
      to,
    } = await orbiter.getBridgeAmount(fromChain, toChain, bridgeAmount);

    const { gasPrice } = await ethAccount.getGasPrice();

    const response = await ethAccount.finalizeTransaction({
      from: ethAccount.address,
      to,
      value: _sendValue,
      gasPrice,
      gas: 21_000,
    });

    logger.info('Sent transaction Orbiter', {
      hash: `${scan}/tx/${response?.transactionHash}`,
      address: ethAccount.address,
    });
  }, 5, 20000);
}

async function transferFromOkxMoneyToGateIo(amount, tokenGate) {
  await waitForOkxBalance((amount - tokenGate) * 1.01, 'ETH');
  const balance = await getTokenBalance('ETH');
  // ARBONE  OPTIMISM
  await withdrawFromOkx(Number(new BigNumber(balance).minus(0.005).toFixed(4)), DEPOSIT_GATE, 'ARBONE');
  await waitForGateBalance(amount * 0.99, 'ETH');
}

async function withdrawFromGate(amountEth, address, chain) {
  await withdrawTokenGate(address, amountEth, 'ETH', chain);
  await waitForEthBalance(web3Eth, amountEth * 0.99, address);
}

async function performActionWithProbability(action, probability, params) {
  if (Math.random() < probability) {
    await action(...params);
    await sleepWithLog();
  }
}

async function doRandomLanding(ethAccountScroll, web3Scroll, scan) {
  const balanceForWorkWei = await ethAccountScroll.getBalance(ethAccountScroll.address);
  const balanceForWork = new BigNumber(balanceForWorkWei).div(1e18).minus(0.01);

  const acions = [depositCogFinance, depositAaveAction, wrapUnwrapAction];

  await performActionWithProbability(sampleFromArray(acions), 0.3, [ethAccountScroll, web3Scroll, scan, balanceForWork]);
  await performActionWithProbability(sampleFromArray(acions), 0.3, [ethAccountScroll, web3Scroll, scan, balanceForWork]);
  await performActionWithProbability(sampleFromArray(acions), 0.3, [ethAccountScroll, web3Scroll, scan, balanceForWork]);
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

  logger.info('Withdraw from okx to', {
    AMOUNT_ETH,
  });

  const ethAccountETH = new EthAccount(privateKey, web3Eth);

  const tokenGate = await getGateTokenBalance('ETH');

  if (tokenGate < AMOUNT_ETH) {
    await transferFromOkxMoneyToGateIo(AMOUNT_ETH, tokenGate);
  }

  await waitForLowerGasPrice();

  await withdrawFromGate(AMOUNT_ETH, ethAccountETH.address, 'ETH');

  const ehtereumBalance = new BigNumber(await ethAccountETH.getBalance()).div(1e18);
  const leaveAmountEthereum = +randomNumber(LEAVE_AMOUNT_ETHEREUM_MAX, LEAVE_AMOUNT_ETHEREUM_MIN).toFixed(5);
  const depositScrollAmount = ehtereumBalance.minus(leaveAmountEthereum);

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

  const scrollBalance = new BigNumber(await ethAccountScroll.getBalance()).div(1e18);
  const leaveAmountScroll = +randomNumber(LEAVE_AMOUNT_SCROLL_MIN, LEAVE_AMOUNT_ETHEREUM_MAX).toFixed(5);
  const bridgeLastChainAmount = scrollBalance.minus(depositScrollAmount).gte(leaveAmountScroll) ? new BigNumber(depositScrollAmount) : scrollBalance.minus(leaveAmountScroll);

  await doRandomLanding(ethAccountScroll, web3Scroll, scanScroll);
  await merkleHyperlane.doBridge('SCROLL', lastChain, bridgeLastChainAmount.multipliedBy(1e18).div(3).toFixed(0));
  await sleepWithLog(15000);
  await doRandomLanding(ethAccountScroll, web3Scroll, scanScroll);
  await merkleHyperlane.doBridge('SCROLL', lastChain, bridgeLastChainAmount.multipliedBy(1e18).div(3).toFixed(0));
  await sleepWithLog(15000);
  await doRandomLanding(ethAccountScroll, web3Scroll, scanScroll);
  await merkleHyperlane.doBridge('SCROLL', lastChain, bridgeLastChainAmount.multipliedBy(1e18).div(3).toFixed(0));

  await waitForEthBalance(web3LastChain, bridgeLastChainAmount - 0.001, lastChainEthAccount.address);

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
