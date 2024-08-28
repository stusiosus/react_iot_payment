import { ethers } from "ethers"; 
const provider = new ethers.BrowserProvider(window.ethereum, "any"); 
const signer= await provider.getSigner(); 

const contractAbi = require("contractAbi.json");

const Contract= new ethers.Contract( 

      contractAddress, 

      contractAbi,

      signer 

    ); 

const result = await Contract.someFunction(); 