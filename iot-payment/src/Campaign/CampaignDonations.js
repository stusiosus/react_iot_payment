import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, List,Typography } from 'antd';
import { Campaign, UsernameRegistry } from '../web3/contracts';

const {Title}=Typography;

const CampaignDonations = () => {
  const location = useLocation();
  const { campaign } = location.state;
  const [contributions, setContributions] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [ownContribution, setOwnContribution] = useState('0');
  const campaignContract = new Campaign();
  const usernameRegistry = new UsernameRegistry();
  const currentUsername = localStorage.userName;

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        await campaignContract.initialize(campaign[1]);
        await usernameRegistry.initialize();

        const contributions = await campaignContract.getAllContributedEvents();
        console.log('Contributions:', contributions); // Debugging line

        const contributors = contributions.map(contribution => contribution.contributor);
        const usernames = {};

        for (const address of contributors) {
          const username = await usernameRegistry.getUsername(address);
          usernames[address] = username;
        }

        setUsernames(usernames);
        setContributions(contributions);

        // Calculate the total contribution of the current user
        const ownTotalContribution = contributions.reduce((total, contribution) => {
          // Fetch username for the contributor
          if (usernames[contribution.contributor] === currentUsername) {
            return total + parseFloat(contribution.amount.toString()); // Add contribution amount
          }
          return total;
        }, 0);

        setOwnContribution(ownTotalContribution.toFixed(2)); // Format to two decimal places
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };

    if (campaign) {
      fetchContributions();
    }
  }, [campaign]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Title>{`Donations for ${campaign[2]}`}</Title>
   
      <p>{`Total Amount Contributed: ${campaign[5]} /  from target Amount : ${campaign[6]}`}</p>
      <p>{`Your Total Contribution: ${ownContribution || '0'} `}</p>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={contributions}
        renderItem={(item) => (
          <List.Item>
            <Card 
              title={usernames[item.contributor] || 'Loading...'} 
              style={{ 
                textAlign: 'center',
                backgroundColor: currentUsername === usernames[item.contributor] ? '#e6f7ff' : '#fff' // Highlight if match
              }}
            >
              <p>{`Amount: ${(item.amount).toString()} `}</p>
            </Card>
          </List.Item>
        )}
        style={{ justifyContent: 'center' }}
      />
    </div>
  );
};

export default CampaignDonations;
