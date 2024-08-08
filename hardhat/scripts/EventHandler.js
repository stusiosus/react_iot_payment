const { ethers } = require("hardhat");
const mqtt = require("mqtt");

const ACTIONFACTORY="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const CAMPAIGN="0x61c36a8d610163660E21a8b7359e1Cac0C9133e1";


async function main(){

    const ActionFactory= await ethers.getContractFactory("ActionFactory");
    const actionFactory=  ActionFactory.attach(ACTIONFACTORY);

    const Campaign=await ethers.getContractFactory("Campaign"); 
    const campaign=Campaign.attach(CAMPAIGN);
    
    actionFactory.on("PayedAction",(actionAddress,id,name,amount)=>{
    
        console.log(actionAddress);
        console.log(id);
        console.log(name);
        console.log(amount);
    
    })

    campaign.on("CampaignEnded",(successfull)=>{

        console.log(successfull);
    })

    campaign.on("ContributionsRefunded",()=>{

        console.log("ContributionsRefunded was successfull");
    })
}

main();
