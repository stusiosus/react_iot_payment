// SPDX-License-Identifier: MIT
const { ethers } = require("hardhat");
var fs = require("fs");




async function main() {

    const OrgnizationFactory=await ethers.getContractFactory("OrganizationFactory");
    const orgnizationFactory=await OrgnizationFactory.deploy();
    await orgnizationFactory.deployed();
    console.log("OrgnizationFactory contract deployed to:", orgnizationFactory.address);

    
    const DeviceFactory=await ethers.getContractFactory("DeviceFactory");
    const deviceFactory=await DeviceFactory.deploy();
    await deviceFactory.deployed();
    console.log("DeviceFactory contract deployed to:", deviceFactory.address);

  
    // Deploy ActionFactory contract
    const ActionFactory = await ethers.getContractFactory("ActionFactory");
    const actionFactory = await ActionFactory.deploy();
    await actionFactory.deployed();
    console.log("ActionFactory contract deployed to:", actionFactory.address);



    const Balance = await ethers.getContractFactory("Balance");
    const balance = await Balance.deploy(actionFactory.address);
    await balance.deployed();
    console.log("Balance contract deployed to:", balance.address);


    await actionFactory.setBalanceContract(balance.address);

     // Deploy Proposal contract
     const Fundraising = await ethers.getContractFactory("Fundraising");
     const fundraising = await Fundraising.deploy();
     await fundraising.deployed();
     console.log("fundraising contract deployed to:", fundraising.address);
 


     // Deploy Proposal contract
     const UsernameRegistry = await ethers.getContractFactory("UsernameRegistry");
     const usernameRegistry = await UsernameRegistry.deploy();
     await usernameRegistry.deployed();
     console.log("campaign contract deployed to:", usernameRegistry.address);
 
 


    /// for testing purpose
  // create device with action 
  // const organisationName="studio6";
  // await orgnizationFactory.createOrganization(organisationName);



  // const DeviceName="pepper";
  // const organizations=await  orgnizationFactory.getOrganizations()

  // const OrganiZation=await ethers.getContractFactory("Organization");
  // const organization=await OrganiZation.attach(organizations[0].NFTAddress)

  // const [owner, addr1,addr2] = await ethers.getSigners();
  // console.log(addr1.address)
  // await organization.mint(addr1.address,0)
  // await organization.mint(addr2.address,1)


  // await deviceFactory.createDevice(DeviceName,actionFactory.address,organizations[0].NFTAddress)
  
  // const devices=await deviceFactory.getDevices(organizations[0].NFTAddress);
  // const Device= await ethers.getContractFactory("Device");
  // const device=  Device.attach(devices[0].deviceAddress)

  // await device.addAction("make elephant", "per action", 2)

  // const actions=await actionFactory.getActions(devices[0].deviceAddress);


  // console.log("The Device: "+DeviceName+ " with the Address : "+ devices[0].deviceAddress+ "  And the Action with Address: "+actions[0].ActionAddress+ "  was ccreatet in Organisation: "+organizations[0].NFTAddress);

  
  // const data =
  // "const DEVICE_CONTRACT=" + device.address + ";\n" +
  // "const DEVICE_FACTORY_CONTRACT=" + deviceFactory.address + ";\n" +
  // "const ACTION_CONTRACT=" + action.address + ";\n" +
  // "const ACTION_FACTORY_CONTRACT=" + actionFactory.address + ";\n";

  console.log("Deployment completed!");



}


 console.log("wrtie addresses to file");

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
