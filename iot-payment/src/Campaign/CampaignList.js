import React, { useEffect, useState } from 'react';
import { Card, Progress, Button, Space, Input, Spin, Modal,Typography,QRCode } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Campaign, FundRaising,UsernameRegistry } from '../web3/contracts';
import { DynamicCardsCampaign } from './DynamicCardsCampaign';
import { getRandomColors } from '../utils';
import { parse, build } from 'eth-url-parser';

const {Title}=Typography;

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [fundAmount, setFundAmount] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [QRCodePayment, setQRCodePayment] = useState(null);
  const [campaignEnded, setCampaignEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [contributed, setContributed] = useState(null);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  const campaignContract = new Campaign();
  const fundRaisingContract = new FundRaising();
  const usernameRegistry = new UsernameRegistry();

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

  const calculateRemainingTime = (startTime, duration) => {
    const endTime = Number(startTime) + Number(duration);
    const now = Math.floor(Date.now() / 1000);
    const remainingSeconds = endTime - now;
    if (remainingSeconds <= 0) {
      return 'Campaign has ended';
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
        value: fundAmount, // (in WEI)
      },
    });

    return url;
  };

  const handleMoreClick = async (_campaign) => {
    
    await usernameRegistry.initialize();
    const username = await usernameRegistry.getUsername(_campaign.creator);

    setUsername(username);
    setSelectedCampaign(_campaign);
    await campaignContract.initialize(_campaign.campaignAddress);
    campaignContract.addContributedListener(listCampaigns);
    campaignContract.addContributedListener(()=>{setSelectedCampaign(selectedCampaign)});
  };

  const handleDonationsClick = () => {
    try {
      // Function to convert BigInt to string
      const convertBigIntToString = (obj) => {
        if (obj && typeof obj === 'object') {
          for (const key in obj) {
            if (typeof obj[key] === 'bigint') {
              obj[key] = obj[key].toString();
            } else if (typeof obj[key] === 'object') {
              convertBigIntToString(obj[key]);
            }
          }
        }
      };
  
      // Clone the selectedCampaign to avoid mutating the original object
      const campaign = JSON.parse(JSON.stringify(selectedCampaign, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
  
      // Navigate with the campaign state
      navigate('/donations', {
        state: { campaign },
      });
    } catch (error) {
      console.error('The selected campaign cannot be serialized', error);
    }
  };
  

  const endCampaign = async () => {
    await campaignContract.initialize(selectedCampaign.campaignAddress);
    await campaignContract.endCampaign();
    listCampaigns();
  };

  const contribute = async () => {
    await campaignContract.initialize(selectedCampaign.campaignAddress);
    await campaignContract.sendFunds(fundAmount);
    setOpenModalPayment(false);
    listCampaigns();
  };

  const enterFunds = (e) => {
    setFundAmount(e.target.value);
  };

  const handlePaymentClick = () => {
    if (!campaignEnded) {
      setOpenModalPayment(true);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Title >All Campaigns from Organization: <span>{localStorage.orgname}</span></Title>
        
        </div>
        <br></br>
      <div style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
        {loading && <Spin size='large' />}
      </div>
      <DynamicCardsCampaign items={campaigns} handleMoreClick={handleMoreClick} />
      {selectedCampaign && (
        <Modal
          visible={Boolean(selectedCampaign)}
          onCancel={() => setSelectedCampaign(null)}
          width={800}
          title='Campaign Details'
          footer={[
            <Button key='payment' type='primary' onClick={handlePaymentClick} disabled={campaignEnded}>
              Contribute
            </Button>,
            <Button key='donations' type='primary' onClick={handleDonationsClick}>
              View Donations
            </Button>,
            <Button key='close' type='primary' onClick={() => setSelectedCampaign(null)}>
              Close
            </Button>,
          ]}
        >
          <h2>{selectedCampaign.description}</h2>
          <p>Action Address: {selectedCampaign.actionAddress}</p>
          <p>Amount already paid: {Number(selectedCampaign.totalAmount)}</p>
          <p>Target Amount: {Number(selectedCampaign.targetAmount)}</p>
          <p>Start Time: {new Date(Number(selectedCampaign.startTime) * 1000).toLocaleString()}</p>
          <p>created by : {username}</p>
          <p>Remaining Time: {remainingTime}</p>

          {campaignEnded && (
            <Button sx={{ display: 'flex', justifyContent: 'center' }} type='primary' onClick={endCampaign}>
              End Campaign and Refund all contributors
            </Button>
          )}
        </Modal>
      )}

      {selectedCampaign && (
        <Modal
          visible={openModalPayment}
          onOk={contribute}
          onCancel={() => setOpenModalPayment(false)}
          width={800}
          title="Contribute to Campaign"
          footer={[
            <Button key="cancel" type="default" onClick={() => setOpenModalPayment(false)}>
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
            
              textAlign: 'center'
            }}
          >
             <br></br>
            <span>Scan Code or enter Fund Amount and then scan the code for sending the exact Amount</span>
            <div style={{textAlign: 'center'}}>
              <br></br>
            {!fundAmount ? (
              <QRCode value={selectedCampaign ? selectedCampaign.campaignAddress : ""} />
            ) : (
              <QRCode value={selectedCampaign ? QRCodePayment : ""} />
            )}
          </div>
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
    </div>
  );
};

export default CampaignList;
