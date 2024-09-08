/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation, and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * https://trufflesuite.com/docs/truffle/reference/configuration
 *
 * Hands-off deployment with Infura
 * --------------------------------
 *
 * Do you have a complex application that requires lots of transactions to deploy?
 * Use this approach to make deployment a breeze 🏖️:
 *
 * Infura deployment needs a wallet provider (like @truffle/hdwallet-provider)
 * to sign transactions before they're sent to a remote public node.
 * Infura accounts are available for free at 🔍: https://infura.io/register
 *
 * You'll need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. You can store your secrets 🤐 in a .env file.
 * In your project root, run `$ npm install dotenv`.
 * Create .env (which should be .gitignored) and declare your MNEMONIC
 * and Infura PROJECT_ID variables inside.
 * For example, your .env file will have the following structure:
 *
 * MNEMONIC = <Your 12 phrase mnemonic>
 * PROJECT_ID = <Your Infura project id>
 *
 * Deployment with Truffle Dashboard (Recommended for best security practice)
 * --------------------------------------------------------------------------
 *
 * Are you concerned about security and minimizing rekt status 🤔?
 * Use this method for best security:
 *
 * Truffle Dashboard lets you review transactions in detail, and leverages
 * MetaMask for signing, so there's no need to copy-paste your mnemonic.
 * More details can be found at 🔎:
 *
 * https://trufflesuite.com/docs/truffle/getting-started/using-the-truffle-dashboard/
 */

// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;

// const HDWalletProvider = require('@truffle/hdwallet-provider');


const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",    // Dirección IP del nodo local
      port: 8545,           // Puerto en el que Ganache está escuchando
      network_id: "*",      // Coincide con cualquier ID de red
      gas: 6721975,         // Establece el límite de gas (opcional)
      gasPrice: 20000000000 // Establece el precio del gas (opcional)
    },
    fuji: {
      provider: () => new HDWalletProvider(
        'sail toast believe panda vague often finish scrap twin hurdle embark train', // Frase mnemotécnica de tu cuenta
        'https://avalanche-fuji.infura.io/v3/1ecc9fc4a1a147149119351a47c51ee1'
      ),
      network_id: 43113, // ID de red para Avalanche Fuji
    },
  },
  compilers: {
    solc: {
      version: "0.8.21", // Reemplaza con la versión que estés utilizando
    },
  },
};