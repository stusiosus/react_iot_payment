const { ethers } = require("hardhat");
const mqtt = require("mqtt");

const ACTIONFACTORY="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";


async function main(){

    const ActionFactory= await ethers.getContractFactory("ActionFactory");
    const actionFactory=  ActionFactory.attach(ACTIONFACTORY);

    
    actionFactory.on("PayedAction",(actionAddress,id,name,amount)=>{
    
        console.log(actionAddress);
        console.log(id);
        console.log(name);
        console.log(amount);
    
    })
}

main();
