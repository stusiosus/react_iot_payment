# Sample Hardhat Project

This Projekt creates an smart Contract Environment for the IoT Payment Framework. Its an marketplace where users can offer IoT Device actions.
Others can claim this actions for paying crypto curriencies.



### for Developing:
With the first command you can simmulate an local blockchain Network.The second command deploy the contracts to this local Blockchain.
Then you have to add an new Network with the rpc url given from the node command to your Metamask.
The source command copies all ABI files generatet by hardhat to the React application .
```shell
npx hardhat node
npx hardhat run --network localhost scripts/deploy.js
source ./copyToReact.sh
```


### Deploy the smart Contract Backend on your preferred network 

Go to the hardhat.config.js file and under networks paste an provider Url and an Private Key for sign the smart contract deploy transactions.
```shell
npx hardhat run --network < the newtwork name > scripts/deploy.js

```
