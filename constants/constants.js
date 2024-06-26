const RPCS = [
  {
    chain: 'ETH', rpc: 'https://rpc.ankr.com/eth', scan: 'https://etherscan.io', token: 'ETH',
  },
  {
    chain: 'ZKSYNC', rpc: 'https://rpc.ankr.com/zksync_era', scan: 'https://www.oklink.com/zksync', token: 'ETH',
  },
  {
    chain: 'ARBITRUM', rpc: 'https://arb1.arbitrum.io/rpc', scan: 'https://arbiscan.io', token: 'ETH',
  },
  {
    chain: 'NOVA', rpc: 'https://rpc.ankr.com/arbitrumnova', scan: 'https://nova.arbiscan.io', token: 'ETH',
  },
  {
    chain: 'OPTIMISM', rpc: 'https://rpc.ankr.com/optimism', scan: 'https://optimistic.etherscan.io', token: 'ETH',
  },
  {
    chain: 'SCROLL', rpc: 'https://rpc.ankr.com/scroll', scan: 'https://scrollscan.com', token: 'ETH',
  },
  {
    chain: 'BASE', rpc: 'https://1rpc.io/base', scan: 'https://basescan.org', token: 'ETH',
  },
  {
    chain: 'LINEA', rpc: 'https://1rpc.io/linea', scan: 'https://lineascan.build', token: 'ETH',
  },
  {
    chain: 'MANTA', rpc: 'https://1rpc.io/manta', scan: 'https://pacific-explorer.manta.network/', token: 'ETH',
  },
  {
    chain: 'ZORA', rpc: 'https://rpc.zora.energy', scan: 'https://explorer.zora.energy/', token: 'ETH',
  },
  {
    chain: 'ZKF', rpc: 'https://rpc.zkfair.io', scan: 'https://scan.zkfair.io', token: 'USDC',
  },
  {
    chain: 'BSC', rpc: 'https://rpc.ankr.com/bsc', scan: 'https://bscscan.com', token: 'BNB',
  },
  {
    chain: 'POLYGON', rpc: 'https://rpc.ankr.com/polygon', scan: 'https://polygonscan.com', token: 'MATIC',
  },
  {
    chain: 'AVAXC', rpc: 'https://avalanche.public-rpc.com', scan: 'https://snowtrace.io', token: 'AVAX',
  },
  {
    chain: 'FTM', rpc: 'https://rpc.ankr.com/fantom', scan: 'https://ftmscan.com', token: 'FTM',
  },
  {
    chain: 'CORE', rpc: 'https://rpc.coredao.org', scan: 'https://scan.coredao.org', token: 'CORE',
  },
  {
    chain: 'METIS', rpc: 'https://andromeda.metis.io/?owner=1088', scan: 'https://andromeda-explorer.metis.io', token: 'METIS',
  },
  {
    chain: 'GNOSIS', rpc: 'https://rpc.ankr.com/gnosis', scan: 'https://gnosisscan.io', token: 'XDAI',
  },
  {
    chain: 'CELO', rpc: 'https://rpc.ankr.com/celo', scan: 'https://celoscan.io', token: 'CELO',
  },
  {
    chain: 'HARMONY', rpc: 'https://rpc.ankr.com/harmony', scan: 'https://explorer.harmony.one', token: 'ONE',
  },
];

const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const INFINITY_APPROVE = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const LAYERBANK_CONTRACT = '0xec53c830f4444a8a56455c6836b5d2aa794289aa';
const LAYERBANK_WETH_CONTRACT = '0x274C3795dadfEbf562932992bF241ae087e0a98C';
const LAYERBANK_USDC = '0x0D8F8e271DD3f2fC58e5716d3Ff7041dBe3F0688';

const AAVE_CONTRACT = '0xff75a4b698e3ec95e608ac0f22a03b8368e05f5d';
const AAVE_WETH_CONTRACT = '0xf301805be1df81102c957f6d4ce29d2b8c056b2a';
const AAVE_POOL_V3 = '0x11fCfe756c05AD438e312a7fd934381537D3cFfe';

const COG_FINANCE_CONTRACT = '0x4ac126e5dd1cd496203a7e703495caa8112a20ca';

const WETH_TOKEN_CONTRACT = '0x5300000000000000000000000000000000000004';
const USDC_TOKEN_ADDRESS = '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4';
const USDT_TOKEN_ADDRESS = '0xf55bec9cafdbe8730f096aa55dad6d22d44099df';

const RETROBRIDGE_NETOWRKS = [{
  id: 'e8a1ff3d-0391-4214-9f0e-e6b691c9a11d',
  name: 'Ethereum',
  chainId: '1',
  network_image_url: '/static/networks/ethereum.svg',
  blockscan_url: 'https://etherscan.io/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://ethereum.publicnode.com',
  category: 'L1 EVM Networks',
}, {
  id: '7f16e773-ac07-447f-9af0-f3b7f244d24b',
  name: 'Polygon',
  chainId: '137',
  network_image_url: '/static/networks/polygon.svg',
  blockscan_url: 'https://polygonscan.com/',
  token_symbol: 'MATIC',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.ankr.com/polygon',
  category: 'L1 EVM Networks',
}, {
  id: '9da2c35c-7b75-450b-97a1-3191a71f6c63',
  name: 'Arbitrum One',
  chainId: '42161',
  network_image_url: '/static/networks/arbitrum.svg',
  blockscan_url: 'https://arbiscan.io/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.ankr.com/arbitrum',
  category: 'L2 EVM Networks',
}, {
  id: 'f51b2b7c-d09c-4502-b72b-86f069a74d92',
  name: 'Optimism',
  chainId: '10',
  network_image_url: '/static/networks/optimism.svg',
  blockscan_url: 'https://optimistic.etherscan.io/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.ankr.com/optimism',
  category: 'L2 EVM Networks',
}, {
  id: '0a2541ef-83ac-48f1-af59-ebf1d438a61d',
  name: 'zkSync Era',
  chainId: '324',
  network_image_url: '/static/networks/zkSyncEra.svg',
  blockscan_url: 'https://explorer.zksync.io/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://mainnet.era.zksync.io',
  category: 'L2 EVM Networks',
}, {
  id: '7142f22b-221c-4d7d-b636-d5f23638b753',
  name: 'Starknet',
  chainId: '0x534e5f4d41494e',
  network_image_url: '/static/networks/starkNet.svg',
  blockscan_url: 'https://starkscan.co/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://starknet-mainnet.public.blastapi.io/rpc/v0.5',
  category: 'L2 EVM Networks',
}, {
  id: '26ef6cb3-f7d8-42fe-a9e4-f7bcfbddb5c3',
  name: 'Base',
  chainId: '8453',
  network_image_url: '/static/networks/base.svg',
  blockscan_url: 'https://basescan.org/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://base.publicnode.com',
  category: 'L2 EVM Networks',
}, {
  id: '2d7e8bbc-193e-4ed5-a512-7cd49c1d27d9',
  name: 'Linea',
  chainId: '59144',
  network_image_url: '/static/networks/linea.svg',
  blockscan_url: 'https://lineascan.build/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.linea.build',
  category: 'L2 EVM Networks',
}, {
  id: 'e6fc724a-6cff-4510-8276-ffcf21f97b03',
  name: 'BNB Chain',
  chainId: '56',
  network_image_url: '/static/networks/binance.svg',
  blockscan_url: 'https://bscscan.com/',
  token_symbol: 'BNB',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://bsc.publicnode.com',
  category: 'L1 EVM Networks',
}, {
  id: '226f910f-2108-492d-9c5d-63dc75c6796b',
  name: 'Avalanche',
  chainId: '43114',
  network_image_url: '/static/networks/avalanche.svg',
  blockscan_url: 'https://snowtrace.io/',
  token_symbol: 'AVAX',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://avalanche-c-chain.publicnode.com',
  category: 'L1 EVM Networks',
}, {
  id: '51748ee9-43dd-49f7-9c4c-7410c6e9c5ba',
  name: 'Arbitrum Nova',
  chainId: '42170',
  network_image_url: '/static/networks/arbitrumNova.svg',
  blockscan_url: 'https://nova-explorer.arbitrum.io/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://arbitrum-nova.publicnode.com',
  category: 'L2 EVM Networks',
}, {
  id: 'b7db1b45-6e3c-4623-b6d7-af31e4bad8eb',
  name: 'Polygon zkEVM',
  chainId: '1101',
  network_image_url: '/static/networks/polygonZkEVM.png',
  blockscan_url: 'https://zkevm.polygonscan.com/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.ankr.com/polygon_zkevm',
  category: 'L2 EVM Networks',
}, {
  id: 'f143deba-ca33-4f9d-be86-c9dfde17dbb9',
  name: 'Scroll',
  chainId: '534352',
  network_image_url: '/static/networks/scroll_network.svg',
  blockscan_url: 'https://blockscout.scroll.io/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.ankr.com/scroll',
  category: 'L2 EVM Networks',
}, {
  id: 'c2ac0244-3e25-42bb-9677-cd8c3746273b',
  name: 'Zora',
  chainId: '7777777',
  network_image_url: '/static/networks/zora.png',
  blockscan_url: 'https://zora.superscan.network/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.zora.co',
  category: 'L2 EVM Networks',
}, {
  id: '2de8dc80-f117-4dc9-9b95-19fb3f60b2d8',
  name: 'Manta Pacific',
  chainId: '169',
  network_image_url: '/static/networks/mantaPacific.png',
  blockscan_url: 'https://pacific-explorer.manta.network/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://pacific-rpc.manta.network/http',
  category: 'L2 EVM Networks',
}, {
  id: '15ca069c-cc8e-45a9-8991-03cf84ea9de5',
  name: 'Mode',
  chainId: '34443',
  network_image_url: '/static/networks/mode.png',
  blockscan_url: 'https://explorer.mode.network/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://1rpc.io/mode',
  category: 'L2 EVM Networks',
}, {
  id: '2cb23b31-d5a5-4b21-8f77-7b65c4561b92',
  name: 'Kroma',
  chainId: '255',
  network_image_url: '/static/networks/kroma.png',
  blockscan_url: 'https://kromascan.com/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://1rpc.io/kroma',
  category: 'L2 EVM Networks',
}, {
  id: 'd2da2429-21f6-4f3c-9979-2f5f967654b4',
  name: 'Mantle',
  chainId: '5000',
  network_image_url: '/static/networks/mantle.svg',
  blockscan_url: 'https://explorer.mantle.xyz/',
  token_symbol: 'MNT',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.mantle.xyz',
  category: 'L2 EVM Networks',
}, {
  id: '531a1820-1852-4b22-8662-1ad9eb1a4443',
  name: 'ZetaChain',
  chainId: '7000',
  network_image_url: '/static/networks/zeta_chain.png',
  blockscan_url: 'https://zetachain.blockscout.com/',
  token_symbol: 'ZETA',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://zetachain-evm.blockpi.network/v1/rpc/public',
  category: 'L2 EVM Networks',
}, {
  id: '2f4af8d9-81fd-4f4a-b428-dfeca99eb160',
  name: 'Blast',
  chainId: '81457',
  network_image_url: '/static/networks/blast.png',
  blockscan_url: 'https://blastscan.io/',
  token_symbol: 'ETH',
  token_decimals: 18,
  is_rpc: !0,
  rpc_url: 'https://rpc.blast.io',
  category: 'L2 EVM Networks',
}];

const BRIDGE_CONTRACTS = {
  DEPOSIT: '0x6774bcbd5cecef1336b5300fb5186a12ddd8b367',
  WITHDRAW: '0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79',
  ORACLE: '0x0d7E906BD9cAFa154b048cFa766Cc1E54E39AF9B',
};

const MERKLE_HYPERLANE = [
  {
    name: 'Optimism',
    chainId: '0xA',
    hyperlane: {
      bridgePrice: '0.000015',
      token: '0xc110e7faa95680c79937ccaca3d1cab7902be25e',
    },
  },
  {
    name: 'Binance Smart Chain',
    chainId: '0x38',
    hyperlane: {
      bridgePrice: '0.0001',
      token: '0xae4789D7C596fdED0e135Bca007152c87a0756f5',
      weth: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    },
  },
  {
    name: 'Arbitrum',
    chainId: '0xA4B1',
    hyperlane: {
      bridgePrice: '0.000015',
      token: '0x233888F5Dc1d3C0360b559aBc029675290DAFa70',
    },
  },
  {
    name: 'Polygon',
    chainId: '0x89',
    hyperlane: {
      bridgePrice: '0.0374',
      token: '0x0cb0354E9C51960a7875724343dfC37B93d32609',
      weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    },
  },
  {
    name: 'Base',
    chainId: '0x2105',
    hyperlane: {
      bridgePrice: '0.000015',
      token: '0x0cb0354E9C51960a7875724343dfC37B93d32609',
    },
  },
  {
    name: 'Scroll',
    chainId: '0x82750',
    hyperlane: {
      bridgePrice: '0.000015',
      token: '0xc0faBF14f8ad908b2dCE4C8aA2e7c1a6bD069957',
    },
  },
];

module.exports = {
  RPCS,
  NATIVE_TOKEN,
  INFINITY_APPROVE,
  ZERO_ADDRESS,
  RETROBRIDGE_NETOWRKS,
  BRIDGE_CONTRACTS,
  MERKLE_HYPERLANE,

  LAYERBANK_CONTRACT,
  LAYERBANK_WETH_CONTRACT,
  LAYERBANK_USDC,

  AAVE_CONTRACT,
  AAVE_WETH_CONTRACT,
  AAVE_POOL_V3,

  COG_FINANCE_CONTRACT,

  WETH_TOKEN_CONTRACT,
  USDC_TOKEN_ADDRESS,
  USDT_TOKEN_ADDRESS,
};
