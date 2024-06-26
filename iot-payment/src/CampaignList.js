import { useState, useEffect } from "react";
import { Card, Progress, Space, Input, Button, Modal } from "antd";
import QRCode from 'qrcode.react'; // Make sure to import QRCode from the correct package
import { Campaign, FundRaising } from "./web3/contracts";
import { parse, build } from 'eth-url-parser';


const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [fundAmount, setFundAmount] = useState(null);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [openModalDonations, setOpenModalDonations] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [QRCodePayment, setQRCodePayment] = useState(null);
  const [campaignEnded, setCampaignEnded] = useState(false);
  const [contributed,setContributed]=useState(null);
  const campaignContract = new Campaign();
  const fundRaisingContract = new FundRaising();

  const listCampaigns = async () => {
    await fundRaisingContract.initialize();
    const campaignsData = await fundRaisingContract.getCampaignsByOrganization(localStorage.orgaddresse);
    setCampaigns(campaignsData);
  };

  useEffect(() => {
    if (localStorage.orgaddresse) listCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      const intervalId = setInterval(() => {
        setRemainingTime(calculateRemainingTime(selectedCampaign.startTime, selectedCampaign.duration));
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }
  }, [selectedCampaign]);

  useEffect(() => {
    if (fundAmount && selectedCampaign) {
      setQRCodePayment(getActionPaymentUrl());
    }
    if (selectedCampaign) {
      isCampaignEnded(selectedCampaign.startTime, selectedCampaign.duration);
      
    }
  }, [fundAmount, selectedCampaign]);

  const contribute = async () => {
    await campaignContract.initialize(selectedCampaign.campaignAddress);
    await campaignContract.sendFunds(fundAmount);
    setOpenModalPayment(false);
    listCampaigns();
  };

  const handleMoreClick = async (_campaign) => {
    setSelectedCampaign(_campaign);
    setOpenModalDetails(true);
    await campaignContract.initialize(_campaign.campaignAddress);
    campaignContract.addContributedListener(listCampaigns);
  };

  const handleOkDetails = () => {
    setOpenModalDetails(false);
  };

  const handleCancelDetails = () => {
    setOpenModalDetails(false);
  };

  const handleOkPayment = () => {
    setOpenModalPayment(false);
  };

  const handleCancelPayment = () => {
    setOpenModalPayment(false);
  };

  const handleOkDonations = () => {
    setOpenModalDonations(false);
  };

  const handleCancelDonations = () => {
    setOpenModalDonations(false);
  };

  const endCampaign = async () => {
    await campaignContract.initialize(selectedCampaign.campaignAddress);
    await campaignContract.endCampaign();
    listCampaigns();
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
    setCampaignEnded(now > endTime);
  };

  const getActionPaymentUrl = () => {
    const url = build({
      scheme: 'ethereum',
      prefix: 'pay',
      target_address: selectedCampaign.campaignAddress,
      parameters: {
        'value': fundAmount, // (in WEI)
      }
    });

    return url;
  };

  const enterFunds = (e) => {
    setFundAmount(e.target.value);
  };

  const handlePaymentClick = () => {
    if (!campaignEnded) {
      setOpenModalPayment(true);
    }
  };

  const handleDonationsClick = async() => {
    await campaignContract.initialize(selectedCampaign.campaignAddress);
    await campaignContract.getAllContributedEvents();
    setContributed(await campaignContract.getContributions())
    setOpenModalDonations(true);
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
                <Progress percent={parseFloat(((Number(campaign.totalAmount) / Number(campaign.targetAmount)) * 100).toFixed(1))} />
              </div>
            </Card>
            <br />
          </>
        ))}

        {selectedCampaign && (
          <Modal
            visible={openModalDetails}
            onOk={handleOkDetails}
            onCancel={handleCancelDetails}
            width={800}
            title="Campaign Details"
            footer={[
              <Button 
                key="payment" 
                type="primary" 
                onClick={handlePaymentClick}
                disabled={campaignEnded}
              >
                Contribute
              </Button>,
              <Button key="donations" type="primary" onClick={handleDonationsClick}>
                View Donations
              </Button>,
              <Button key="close" type="primary" onClick={handleOkDetails}>
                Close
              </Button>,
            ]}
          >
            <h2>{selectedCampaign.description}</h2>
            <p>Action Address: {selectedCampaign.actionAddress}</p>
            <p>Amount already paid: {Number(selectedCampaign.totalAmount)}</p>
            <p>Target Amount: {Number(selectedCampaign.targetAmount)}</p>
            <p>Start Time: {new Date(Number(selectedCampaign.startTime) * 1000).toLocaleString()}</p>
            <p>Remaining Time: {remainingTime}</p>

            {campaignEnded && (
              <Button sx={{display:"flex",justifyContent:"center"}}type="primary" onClick={endCampaign}>
                End Campaign and Refund all contributors
              </Button>
            )}
          </Modal>
        )}

        {selectedCampaign && (
          <Modal
            visible={openModalPayment}
            onOk={handleOkPayment}
            onCancel={handleCancelPayment}
            width={800}
            title="Contribute to Campaign"
            footer={[
              <Button key="cancel" type="default" onClick={handleCancelPayment}>
                Cancel
              </Button>,
              <Button key="contribute" type="primary" onClick={contribute}>
                Contribute
              </Button>,
            ]}
          >
            <h2>{selectedCampaign.description}</h2>
            <p>Target Amount: {Number(selectedCampaign.targetAmount)}</p>
            <p>Remaining Time: {remainingTime}</p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <span>Scan Code or enter Fund Amount and then scan the code for sending the exact Amount</span>
              {!fundAmount ?
                <QRCode value={selectedCampaign ? selectedCampaign.campaignAddress : ""} />
                : <QRCode value={selectedCampaign ? QRCodePayment : ""} />}
            </div>
            <br />

            <Space style={{ width: "100%" }}>
              <Input
                placeholder="Amount to fund"
                value={fundAmount}
                onChange={enterFunds}
              />
            </Space>

            <p>({(fundAmount / Number(selectedCampaign.targetAmount)) * 100} % from the Total Amount)</p>
          </Modal>
        )}

        {selectedCampaign && (
          <Modal
            visible={openModalDonations}
            onOk={handleOkDonations}
            onCancel={handleCancelDonations}
            width={800}
            title="View Donations"
            footer={[
              <Button key="close" type="default" onClick={handleOkDonations}>
                Close
              </Button>,
            ]}
          >
            <h2>Donations for {selectedCampaign.description}</h2>
            <p>Total Amount Contributed: {Number(selectedCampaign.totalAmount)}</p>
            <p>Your Contribution: {contributed}</p>
          </Modal>
        )}
      </div>
    </>
  );
};


export default CampaignList;
