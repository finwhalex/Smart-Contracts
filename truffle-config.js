require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const utils = require('web3-utils');

module.exports = {
  
  networks: {
  
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },

    mainnet: {
      provider: () => new HDWalletProvider(process.env.OWNER_MNEMONIC, `https://mainnet.infura.io/v3/${process.env.INFURA}`, 0),
      network_id: 1,
      //gas: 500000,
      gasPrice: utils.toWei("5", "gwei"),
    },

    rinkeby: {
      provider: () => new HDWalletProvider(process.env.OWNER_MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.INFURA}`, 0),
      network_id: 4,
      //gas: 500000,
      gasPrice: utils.toWei("2", "gwei"),
      skipDryRun: true
    }
  },

  compilers: {
    solc: {    
      version: "0.5.10",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
