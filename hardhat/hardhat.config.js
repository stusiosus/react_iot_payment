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
  "a6213958acf3a860e1b4f3716833b466097094915da8e3678366db1897be4d93";
ETHERSCAN_API_KEY = "FY4AGJQ7CIKQA6VQX8Y27AWT45268313RM";

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};