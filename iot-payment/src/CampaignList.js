import { useState, useEffect } from "react";
import { Card, Progress, Space, Input, Button, Modal } from "antd";
import QRCode from 'qrcode.react'; // Make sure to import QRCode from the correct package
import { Campaign, FundRaising } from "./web3/contracts";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [fundAmount, setFundAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const campaignContract = new Campaign();
  const fundRaisingContract = new FundRaising();

  const listCampaigns = async () => {
    await fundRaisingContract.initialize();
    const campaignsData = await fundRaisingContract.getCampaignsByOrganization(localStorage.orgaddresse);
    setCampaigns(campaignsData);
  };

  useEffect(() => {
    listCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      const intervalId = setInterval(() => {
        setRemainingTime(calculateRemainingTime(selectedCampaign.startTime, selectedCampaign.duration));
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }
  }, [selectedCampaign]);

  const contribute = async () => {
    await campaignContract.initialize(selectedCampaign.campaignAddress);
    await campaignContract.sendFunds(fundAmount);
  };

  const handleMoreClick = async (_campaign) => {
    setSelectedCampaign(_campaign);
    setOpenModal(true);
    await campaignContract.initialize(_campaign.campaignAddress);
    campaignContract.addContributedListener(listCampaigns);
  };

  const handleOk = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const endCampaign = async () => {
    await campaignContract.initialize(selectedCampaign.campaignAddress);
    await campaignContract.endCampaign();
  };

  const calculateRemainingTime = (startTime, duration) => {
    const endTime = Number(startTime) + Number(duration);
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = endTime - now;
    if (remainingSeconds <= 0) {
      return "Campaign has ended";
    }
    const days = Math.floor(remainingSeconds / (24 * 60 * 60));
    const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
    const seconds = remainingSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const isCampaignEnded = (startTime, duration) => {
    const endTime = Number(startTime) + Number(duration);
    const now = Math.floor(Date.now() / 1000);
    return now > endTime;
  };

  return (
    <>
    <div>
      {campaigns.map((campaign, index) => (
        <>
        <Card
          size="small"
          title={campaign.description}
          extra={<a onClick={() => handleMoreClick(campaign)}>More</a>}
          style={{ width: 300 }}
          key={index}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Progress percent={(Number(campaign.totalAmount) / Number(campaign.targetAmount)) * 100} />
          </div>
        </Card>

        <br></br>
        </>
      ))}

      {selectedCampaign && (
        <Modal
          visible={openModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <h2>{selectedCampaign.description}</h2>
          <p>Action Address: {selectedCampaign.actionAddress}</p>
          <p>Amount already paid: {Number(selectedCampaign.totalAmount)}</p>
          <p>Target Amount: {Number(selectedCampaign.targetAmount)}</p>
          <p>Start Time: {new Date(Number(selectedCampaign.startTime) * 1000).toLocaleString()}</p>
          <p>Duration: {Number(selectedCampaign.duration)} seconds</p>
          <p>Remaining Time: {remainingTime}</p>

          <hr></hr>
          <br></br>
          <br></br>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <QRCode value={selectedCampaign ? selectedCampaign.campaignAddress : ""} />
          </div>
          <br></br>

          <Space style={{ width: "150%" }}>
            <Input
              placeholder="Amount to fund"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
            />
            <Button type="primary" onClick={() => contribute()}>
              Send {fundAmount} to Campaign
            </Button>
          </Space>

          <p>({(fundAmount / Number(selectedCampaign.targetAmount)) * 100} % from the Total Amount)</p>
          <br></br>
          <br></br>
          {isCampaignEnded(selectedCampaign.startTime, selectedCampaign.duration) && (
            <Button type="primary" onClick={endCampaign}>End Campaign and Refund all contributors</Button>
          )}
        </Modal>
        
      )}
    </div>
    
    </>
  );
};

export default CampaignList;
