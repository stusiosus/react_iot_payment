// SPDX-License-Identifier: MIT
const { ethers } = require("hardhat");
var fs = require("fs");


async function main() {
    
    const DeviceFactory=await ethers.getContractFactory("DeviceFactory");
    const deviceFactory=await DeviceFactory.deploy();
    await deviceFactory.deployed();
    console.log("DeviceFactory contract deployed to:", deviceFactory.address);

  
    // Deploy ActionFactory contract
    const ActionFactory = await ethers.getContractFactory("ActionFactory");
    const actionFactory = await ActionFactory.deploy();
    await actionFactory.deployed();
    console.log("ActionFactory contract deployed to:", actionFactory.address);
  
    // Deploy Device contract
    const Device = await ethers.getContractFactory("Device");
    const device = await Device.deploy(0,"Pepper",actionFactory.address,"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await device.deployed();
    console.log("Device contract deployed to:", device.address);
  

  // Deploy Action contract
  const Action = await ethers.getContractFactory("Action");
  const action = await Action.deploy(0,"saySomething","word",1,device.address,actionFactory.address);
  await action.deployed();
  console.log("Action contract deployed to:", action.address);

  const Balance = await ethers.getContractFactory("Balance");
  const balance = await Balance.deploy(actionFactory.address);
  await balance.deployed();
  console.log("Balance contract deployed to:", balance.address);

  await actionFactory.setBalanceContract(balance.address);

  
  const data =
  "const DEVICE_CONTRACT=" + device.address + ";\n" +
  "const DEVICE_FACTORY_CONTRACT=" + deviceFactory.address + ";\n" +
  "const ACTION_CONTRACT=" + action.address + ";\n" +
  "const ACTION_FACTORY_CONTRACT=" + actionFactory.address + ";\n";

  console.log("Deployment completed!");


fs.writeFile('./ContractAddresses.txt',"TEST",'utf8', function(err) {
  if (err) {
    console.error("Error writing data to file:", err);
    return;
  }
  console.log("Data written successfully!");
  console.log("Let's read newly written data");
});
}


 console.log("wrtie addresses to file");

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
