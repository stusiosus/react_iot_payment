import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, List } from 'antd';
import { Campaign } from '../web3/contracts';

const CampaignDonations = () => {
  const location = useLocation();
  const { campaign } = location.state || {};
  const [contributions, setContributions] = useState([]);
  const campaignContract = new Campaign();

  useEffect(() => {

    const fetchContributions = async () => {
      await campaignContract.initialize(campaign.campaignAddress);
      const contributions = await campaignContract.getContributions();
      setContributions(contributions);
    };

    if (campaign) {
      fetchContributions();
    }
  }, [campaign]);

  return (
    <div>
      <h2>Donations for {campaign.description}</h2>
      <p>Total Amount Contributed: {Number(campaign.totalAmount)}</p>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={contributions}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.contributor}>
              <p>Amount: {item.amount}</p>
              <p>Date: {new Date(Number(item.timestamp) * 1000).toLocaleString()}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CampaignDonations;
