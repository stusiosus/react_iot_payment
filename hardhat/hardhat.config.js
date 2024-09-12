// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.24",
// };

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

const mainnetUrl =
  "https://mainnet.infura.io/v3/02d0f5491c014e48948a672fdd810490";

INFURA_API_KEY =
  "https://sepolia.infura.io/v3/02d0f5491c014e48948a672fdd810490";
PRIVATE_KEY =
  "3710bcabac9fb38738fc021c08b63683bfa1ff4f3c749dd58b38673b173b797a";
ETHERSCAN_API_KEY = "FY4AGJQ7CIKQA6VQX8Y27AWT45268313RM";

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      // See: https://hardhat.org/hardhat-network/docs/reference#mining-modes
      mining: {
        auto: true,
        // Produce new block every 3 minutes to resolve next issues
        // https://github.com/NomicFoundation/hardhat/issues/2053
        // https://github.com/ethers-io/ethers.js/issues/2338
        // https://github.com/ethers-io/ethers.js/discussions/4116
        interval: 3 * 60 * 1000, // should be less then 5 minutes to make event subscription work
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
