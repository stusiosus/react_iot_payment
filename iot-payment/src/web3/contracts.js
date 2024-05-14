import { ethers } from "ethers";

const deviceAbi = require("../Abi/Device.json");
const deviceFactoryAbi = require("../Abi/DeviceFactory.json");
const actionFactoryAbi = require("../Abi/ActionFactory.json");
const actionAbi = require("../Abi/Action.json");
const balanceABI = require("../Abi/Balance.json");

const provider = new ethers.BrowserProvider(window.ethereum, "any");

const DEVICE_FACTORY_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ACTION_FACCTORY_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const DEVICE_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const ACTION_CONTRACT = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const BALANCE_CONTRACT = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

// export  class Chain{

//   constructor(){this.initialize()}

//   async initialize(){
//     this.provider = new ethers.BrowserProvider(window.ethereum,"any");
//     const chainId=(await this.provider._detectNetwork()).chainId;

//     this.signer= await this.provider.getSigner();
//   }

//   async doPayment(addr,ether){
//     const tx = await this.signer.sendTransaction({
//       to: addr,
//       value: ethers.parseEther(ether)
//     })
//   }

// }

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
    try {
      return await this.deviceFactoryContract.getDevices();
    } catch (error) {
      console.error("Error getting devices:", error);
      throw error;
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
    debugger;
    try {
      await this.deviceFactoryContract.createDevice(
        name,
        ACTION_FACCTORY_CONTRACT
      );
    } catch (error) {
      console.error("Error adding device:", error);
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

  async possibleActions(){
    return await this.actionContract.possibleActions();
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
