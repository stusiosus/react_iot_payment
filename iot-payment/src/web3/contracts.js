import { ethers } from "ethers";

const deviceAbi = require("../Abi/Device.json");
const deviceFactoryAbi = require("../Abi/DeviceFactory.json");
const actionFactoryAbi = require("../Abi/ActionFactory.json");
const actionAbi = require("../Abi/Action.json");
const balanceABI = require("../Abi/Balance.json");
const organizationFactoryABI = require("../Abi/OrganizationFactory.json");
const organizationABI=require("../Abi/Organization.json");

const ORGANIZATION_FACTORY_CONTRACT = "0x333bF3FcBCEa1C25Bc6E6740F0b9fcbDA57405D8";
const DEVICE_FACTORY_CONTRACT = "0x1A1Ce36B60d8A224D7256A8ac994bC5c7352d075";
const ACTION_FACCTORY_CONTRACT = "0x1267a75585A235Aa85701523F98D910957420e81";
const BALANCE_CONTRACT = "0xECCe3E4Bd667fdb13622173b406a80e605AB8C3E";



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
        value: ethers.parseEther(amount),
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
  // constructor() {
  //   this.initialize();
  // }

  async initialize(address) {
    this.signer = await provider.getSigner();

    this.actionContract = new ethers.Contract(
      address,
      actionAbi.abi,
      this.signer
    );
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
        value: ethers.parseEther(amount),
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
