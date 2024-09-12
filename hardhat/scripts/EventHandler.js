const { ethers } = require("hardhat");

const ACTIONFACTORY_ADDRESS = "0xa0381BB6F88b56B00de2dD911Bc08D9E199379dF";
const CAMPAIGN_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const SEPOLIAURL =
  "https://sepolia.infura.io/v3/02d0f5491c014e48948a672fdd810490";

async function main() {
  // Sepolia-Provider verwenden
  const provider = new ethers.providers.JsonRpcProvider(SEPOLIAURL);

  const ActionFactory = await ethers.getContractFactory("ActionFactory");
  const actionFactory = ActionFactory.attach(ACTIONFACTORY_ADDRESS).connect(
    provider
  );

  const Campaign = await ethers.getContractFactory("Campaign");
  const campaign = Campaign.attach(CAMPAIGN_ADDRESS).connect(provider);

  // Event Listener für PayedAction hinzufügen
  actionFactory.on("PayedAction", (actionAddress, id, name, amount) => {
    console.log(`PayedAction event detected:`);
    console.log(`Action Address: ${actionAddress}`);
    console.log(`ID: ${id.toString()}`);
    console.log(`Name: ${name}`);
    console.log(`Amount: ${ethers.utils.formatEther(amount)} ETH`);
  });

  // Event Listener für CampaignEnded hinzufügen
  campaign.on("CampaignEnded", (successful) => {
    console.log(`CampaignEnded event detected: Successful = ${successful}`);
  });

  // Event Listener für ContributionsRefunded hinzufügen
  campaign.on("ContributionsRefunded", () => {
    console.log(
      "ContributionsRefunded event detected: Contributions were refunded"
    );
  });

  console.log("Listening for events...");

  // Keep the process running
  process.stdin.resume();
}

main()
  .then(() => {
    console.log("Setup complete.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
