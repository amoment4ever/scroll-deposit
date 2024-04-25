const { HttpsProxyAgent } = require('https-proxy-agent');
const { Web3 } = require('web3');
const { RPCS } = require('../constants/constants');
const { proxies } = require('../proxies');
const { LinkedList } = require('../utils/linked-list');

const web3sOptimismList = new LinkedList([]);

const RPC_OPTIMISM = RPCS.find((item) => item.chain === 'OPTIMISM');

proxies.array.forEach((proxy) => {
  let agent;

  if (proxy.proxy) {
    agent = new HttpsProxyAgent(proxy.proxy);
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(RPC_OPTIMISM.rpc, {
    providerOptions: { agent },
  }));

  // console.log(web3.provider.httpProviderOptions.providerOptions);
  // web3.provider.httpProviderOptions.agent = agent;

  web3sOptimismList.push({ web3, scan: RPC_OPTIMISM.scan, proxy });
});

module.exports = {
  web3sOptimismList,
};
