import { ethers } from "ethers";

const deviceAbi = require("../Abi/Device.json");
const deviceFactoryAbi = require("../Abi/DeviceFactory.json");
const actionFactoryAbi = require("../Abi/ActionFactory.json");
const actionAbi = require("../Abi/Action.json");
const balanceABI = require("../Abi/Balance.json");
const organizationFactoryABI = require("../Abi/OrganizationFactory.json");
const organizationABI=require("../Abi/Organization.json");
const fundraisingABI=require("../Abi/FundRaising.json");
const campaignABI=require("../Abi/Campaign.json");
const usernameRegistry=require("../Abi/UsernameRegistry.json")


// const ORGANIZATION_FACTORY_CONTRACT = "0xF4cF319e0c1313937A36211f1A5a4B127d45038d";
// const DEVICE_FACTORY_CONTRACT = "0x69Ce1e91c667a59B9a1269eC8696dCace54E253d";
// const ACTION_FACCTORY_CONTRACT = "0x437B80947f20ada40549f0c05aba727f85ccFbEE";
// const BALANCE_CONTRACT = "0xBCBA348fd4B33AAd8Bb133A3d0D6dF9Fd33f7d09";
// const FUNDRAISING_CONTRACT="0xF11e14555DDfdAB77A0F361c4f6142f26d52fbA5";

const ORGANIZATION_FACTORY_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const DEVICE_FACTORY_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const ACTION_FACCTORY_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const BALANCE_CONTRACT = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const FUNDRAISING_CONTRACT="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const USERNAMEREGISTRY_CONTRACT="0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";


let provider=undefined

try{provider = new ethers.BrowserProvider(window.ethereum, "any");}

catch{console.log("no provider was found")}


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
    console.log(this.signer.address)
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
  removeOrganization
 
  async removeOrganization(address){
    await this.organizationFactoryContract.removeOrganization(address);
  }

 setOrganizationListenerCreate(callback) {
    this.organizationFactoryContract.on("OrganizationCreated", (id, name, creator) => {
      callback();
    });
  }
  setOrganizationListenerAdd(callback) {
    this.organizationFactoryContract.on("OrganizationAdded", (user,organizatioonAddress) => {
      callback();
    });
  }
  setOrganizationListenerRemove(callback) {
    this.organizationFactoryContract.on("OrganizationRemoved", (user,organizatioonAddress) => {
      callback();
    });
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

    if (localStorage.orgaddresse){
      
      return await this.deviceFactoryContract.getDevices(address);
    }
    else{
      return [];
    }
  }

  setDeviceListenerCreate(callback) {
    this.deviceFactoryContract.on("DeviceCreated", (action, id, name, factoryaddress) => {
      callback();
    });
  }
  setDeviceListenerUpdate(callback) {
    this.deviceFactoryContract.on("DeviceUpdated", ( id,newName) => {
      callback();
    });
  }
  setDeviceListenerDelete(callback) {
    this.deviceFactoryContract.on("DeviceDeleted", ( id) => {
      callback();
    });
  }

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
  async deleteDevice(deviceId){
    await this.deviceFactoryContract.deleteDevice(deviceId);
  }
  async updateDeviceName(deviceId,newName){
    await this.deviceFactoryContract.updateDeviceName(deviceId,newName);
  }
  
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
  async updateActionName(actionId, newname) {
    await this.actionFactoryContract.updateActionName(
      actionId,
     newname
    );
  }
  async updateActionUnit(actionId, newUnit) {
    await this.actionFactoryContract.updateActionUnit(
      actionId,
      newUnit
    );
  }
  async deleteAction(actionId){
    await this.actionFactoryContract.deleteAction(
      actionId
    );
  }
  setActionListenerCreate(callback) {
    this.actionFactoryContract.on("ActionCreated", (action, id, name, unit,deviceAddress,_organisationAddress) => {
      callback();
    });
  }
  setActionListenerDelete(callback) {
    this.actionFactoryContract.on("ActionDeleted", (id) => {
      callback();
    });
  }
  setActionListenerUpdate(callback) {
    this.actionFactoryContract.on("ActionUpdated", (id,newName,newUnit,newPrice) => {
      callback();
    });
  }

  setActionListenerPayed(callback) {
    this.actionFactoryContract.on("PayedAction", (actionaddress,id,name,amount) => {
      callback();
    });
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


export class FundRaising {
  async initialize() {
    this.signer = await provider.getSigner();
    this.FundRaisingContract = new ethers.Contract(
      FUNDRAISING_CONTRACT,
      fundraisingABI.abi,
      this.signer
    );
  }

  async createCampaign(description,organization,action,duration,amount) {
    await this.FundRaisingContract.createCampaign(description,organization,action,duration,amount)
  }
  async getCampaignsByOrganization(organization) {
   return  await this.FundRaisingContract.getCampaignsByOrganization(organization);  
  }
 
  setCampaignListenerCreate(callback) {
    this.FundRaisingContract.on("CampaignCreated", (campaignId,campaignaddress,description,organizationAddress,duration,targetAmount
    ) => {
      callback();
    });
  }

}

export class Campaign {
  async initialize(campaignAddress) {
    this.signer = await provider.getSigner();
    this.CampaignContract = new ethers.Contract(
      campaignAddress,
      campaignABI.abi,
      this.signer
    );
  }

 
  async sendFunds(amount) {
    
    try {
      const tx = await this.signer.sendTransaction({
        to: this.CampaignContract,
        value: amount,
      });
    } catch (e) {
      alert(e);
    }
  };
  async endCampaign(){
    await this.CampaignContract.endCampaign();
  };

  addContributedListener(callback) {
    this.CampaignContract.on("Contributed", (contributor, amount) => {
      callback();
    });
  }

  async getContributions()  {
    const contributions=await this.CampaignContract.getContributions(this.signer.address);

    return contributions.toString()
  }

  
  async  getAllContributedEvents() {
    try {
      const filter = this.CampaignContract.filters.Contributed();

      const events = await this.CampaignContract.queryFilter(filter, 0, 'latest');
      let event_list=[]
    
      events.forEach(event =>{
          const { contributor, amount } = event.args;

          event_list.push( event.args)
          console.log(`Contributor: ${contributor}, Amount: ${ethers.formatEther(amount)} ETH`);
      });
      return event_list
  } catch (error) {
      console.error('Error fetching events:', error);
  }
}

}

export class UsernameRegistry{

  async initialize() {
    this.signer = await provider.getSigner();
    this.usernameRegestry = new ethers.Contract(
      USERNAMEREGISTRY_CONTRACT,
      usernameRegistry.abi,
      this.signer
    );
  }

  async createUsername(username){
    await this.usernameRegestry.createUsername(username)
  }
  async updateUsername(newUsername){
    await this.usernameRegestry.updateUsername(newUsername)
  }
  async getUsername(useraddress){

    try{    
      return await this.usernameRegestry.getUsername(useraddress)
    }

  catch{
    return ""
  }
  }

}