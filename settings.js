// sleep между действиями
const SLEEP_MIN_MS = 10000;
const SLEEP_MAX_MS = 20000;

// sleep между акками
const SLEEP_MIN_ACC_MS = 20_000;
const SLEEP_MAX_ACC_MS = 30_000;

const MIN_AMOUNT_ETH = 0.7;
const MAX_AMOUNT_ETH = 1;

const AMOUNT_BORROW_PERCENT = 0.5;

const MAX_SWAP_USDC = 800;
const MAX_SWAP_ETH = 0.3;

const MAX_GWEI_ETH = 10;

module.exports = {
  SLEEP_MIN_MS,
  SLEEP_MAX_MS,
  MIN_AMOUNT_ETH,
  MAX_AMOUNT_ETH,
  AMOUNT_BORROW_PERCENT,
  MAX_GWEI_ETH,
  MAX_SWAP_USDC,
  SLEEP_MIN_ACC_MS,
  SLEEP_MAX_ACC_MS,
  MAX_SWAP_ETH,
};
