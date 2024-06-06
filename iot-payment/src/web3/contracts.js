import { ethers } from "ethers";

const deviceAbi = require("../Abi/Device.json");
const deviceFactoryAbi = require("../Abi/DeviceFactory.json");
const actionFactoryAbi = require("../Abi/ActionFactory.json");
const actionAbi = require("../Abi/Action.json");
const balanceABI = require("../Abi/Balance.json");
const organizationFactoryABI = require("../Abi/OrganizationFactory.json");
const organizationABI=require("../Abi/Organization.json");

const ORGANIZATION_FACTORY_CONTRACT = "0xF95D936a770BA6A26aF3d01ced6C354D7B5a6465";
const DEVICE_FACTORY_CONTRACT = "0x2AAc0823376bbb4b92Ef4e500F8A7e5A16bcFcca";
const ACTION_FACCTORY_CONTRACT = "0xCbF07AB9985b073FcBe2Fee6E6e1801a7Ed4d014";
const BALANCE_CONTRACT = "0x5354BEb3B48fc6f09F1d6b0D6f91D86a1EdDd803";

// const ORGANIZATION_FACTORY_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const DEVICE_FACTORY_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// const ACTION_FACCTORY_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const BALANCE_CONTRACT = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";





let provider = new ethers.BrowserProvider(window.ethereum, "any");

async function setProvider(){
  
  let provider = new ethers.BrowserProvider(window.ethereum, "any");
  const add=(await provider.getSigner()).address;

  if (localStorage.signerAddress!=add)
  {
    localStorage.removeItem("orgid");
    localStorage.removeItem("orgname");
    localStorage.removeItem("orgaddresse");
  }

  localStorage.setItem("signerAddress",add);
}
setProvider();



export class OrganizationFactory{

  constructor(){}

  async initialize() {
    this.signer = await provider.getSigner();
    this.organizationFactoryContract = new ethers.Contract(
      ORGANIZATION_FACTORY_CONTRACT,
      organizationFactoryABI.abi,
      this.signer
    );
  }

  async createOrganization(name){
    await this.organizationFactoryContract.createOrganization(name.toString());
  }
  async getOrganizations(){
    try{return await this.organizationFactoryContract.getOrganizations();}
    catch (e){
      alert(e);
    }
  }
  async addOrganization(address){
    await this.organizationFactoryContract.addOrganization(address);
  }



}

export class Organization{

  constructor(){}

  async initialize(organisationAddress) {
    this.signer = await provider.getSigner();
    this.organizationContract = new ethers.Contract(
      organisationAddress,
      organizationABI.abi,
      this.signer
    );
  }

  async mintOrganizationToken(recieverAddress,status){
    try{
      await this.organizationContract.mint(recieverAddress,status);
    }
    catch (e){
      alert(e)
    }
  }
  async isAdmin(){
    return this.organizationContract.isAdmin(this.signer.address);
  }

}


export class DeviceFactory {
  constructor() {
    this.initialize();
  }

  async initialize() {
    this.signer = await provider.getSigner();
    this.deviceFactoryContract = new ethers.Contract(
      DEVICE_FACTORY_CONTRACT,
      deviceFactoryAbi.abi,
      this.signer
    );
  }

  async getDevices() {
    const address=localStorage.orgaddresse;
    console.log(address)
    if (localStorage.orgaddresse){
      
      try {
        return await this.deviceFactoryContract.getDevices(address);
      } catch (error) {
        alert(error);
        throw error;
      }
    }
    else{
      return [];
    }
    

    
  }

  setDeviceListener = () => {
    this.deviceFactoryContract
      .on("DeviceCreated", (action, id, name, factoryaddress) => {
        console.log("Device created:", name);
      })
      .catch((error) => {
        console.error("Error in event listener:", error);
      });
  };

  addDevice = async (name) => {
    try {
      await this.deviceFactoryContract.createDevice(
        name,
        ACTION_FACCTORY_CONTRACT,
        localStorage.orgaddresse
      );
    } catch (error) {
      alert(error);
      throw error;
    }
  };
}

export class Device {
  constructor() {}

  async initialize(address) {
    this.deviceAddress = address;

    this.signer = await provider.getSigner();
    this.deviceContract = new ethers.Contract(
      address,
      deviceAbi.abi,
      this.signer
    );
  }

  async getOwner() {
    return await this.deviceContract.owner();
  }

  async getBalanceDevice() {
    const balance = await this.deviceContract.getBalanceDevice();
    return ethers.formatEther(balance);
  }

  async addActionListener() {}

  async addAction(name, unit, price) {
    try {
      await this.deviceContract.addAction(name, unit, price);
    } catch (e) {
      alert(e);
    }
  }

  async getBalanceUser() {
    const balance = await this.deviceContract.getBalanceUser(
      ethers.getAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    );
    return ethers.formatEther(balance);
  }

  async sendFunds(amount) {
    try {
      const tx = await this.signer.sendTransaction({
        to: this.deviceAddress,
        value: amount,
      });
    } catch (e) {
      alert(e);
    }
  }
}

export class ActionFactory {
  constructor() {
    this.initialize();
  }

  async initialize() {
    this.signer = await provider.getSigner();

    this.actionFactoryContract = new ethers.Contract(
      ACTION_FACCTORY_CONTRACT,
      actionFactoryAbi.abi,
      this.signer
    );
  }

  async getActions(deviceAddress) {
    const rawActions = await this.actionFactoryContract.getActions(
      deviceAddress
    );
    var cleanedResults = [];
    console.log(rawActions);

    for (var i in rawActions) {
      if (rawActions[i].deviceAddress.toString() == deviceAddress.toString()) {
        cleanedResults.push(rawActions[i]);
      }
    }
    return cleanedResults;
  }

  async updateActionPrice(actionId, newPrice) {
    await this.actionFactoryContract.updateActionPrice(
      actionId,
      Number(newPrice)
    );
  }
}

export class Action {

  async initialize(address) {
    this.signer = await provider.getSigner();
    this.address=address;

    this.actionContract = new ethers.Contract(
      address,
      actionAbi.abi,
      this.signer
    );
  }

  async payActionInstant(amount){
    try {
      const tx = await this.signer.sendTransaction({
        to: this.address,
        value:(amount).toString(),
      });
    } catch (e) {
      alert(e);
    }
  }
  async payAction(amount){
   await this.actionContract.payAction(amount);
  }

  async possibleActionsAmount(){
    return await this.actionContract.possibleActionsAmount();
  }

  async setPrice(price) {
    return await this.actionContract.setPrice(price);
  }
}

export class Balance {
  async initialize() {
    this.signer = await provider.getSigner();
    this.balanceContract = new ethers.Contract(
      BALANCE_CONTRACT,
      balanceABI.abi,
      this.signer
    );
  }

  async getBalance() {
    return (await this.balanceContract.getBalance(this.signer)).toString();
  }
  async deposit(amount) {
    try {
      const tx = await this.signer.sendTransaction({
        to: BALANCE_CONTRACT,
        value: amount,
      });
    } catch (e) {
      alert(e);
    }
  }

  async withdraw(amount) {
    try {
      await this.balanceContract.withdraw(amount);
    } catch (e) {
      alert(e);
    }
  }
}
