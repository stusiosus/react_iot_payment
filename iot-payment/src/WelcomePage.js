import React from "react";
import { Card, List, Typography } from "antd";
import { Link } from "react-router-dom";


const { Title, Paragraph } = Typography;

const WelcomePage = () => {
    const sections = [
        {
          title: "Introduction",
          content: (
            <>
              <Paragraph>
                This platform serves as a service intermediary for IoT device owners and users. It allows for the management and utilization of services provided by various internet-connected devices.
              </Paragraph>
              <Paragraph>
                For example, users can pay for a vacuum cleaner robot's services through the platform.
              </Paragraph>
            </>
          )
        },
        {
          title: "Target Users",
          content: (
            <>
              <Paragraph>The platform is designed for two main user groups:</Paragraph>
              <ul>
                <li><strong>IoT Device Owners</strong>: Individuals who own IoT devices and want to offer their services.</li>
                <li><strong>Service Users</strong>: Individuals who want to use the services provided by the IoT devices.</li>
              </ul>
              <Paragraph>
                Both user groups interact through a Web3 wallet, and they are distinguished by their roles and permissions within the platform.
              </Paragraph>
            </>
          )
        },
        {
            title: "Setup",
            content: (
              <>
                <Paragraph>Things you needed to get startet:</Paragraph>
                <ul>
                    <li><strong>Meta Mask with Sepolia ETH</strong>: The application is deployed on Sepolia Eth for test purpose.To deploy it on other network get the repo and deploy it to your network of choice.</li>
                    <li><strong>IoT Device</strong>:you need at leat one IoT Device with an MQTT interface wich you want to Inlcude into this payment application</li>
                  <li><strong>MQTT Broker</strong>: Is required for MQTT communication</li>
                  <li><strong>MQTT Client with gateway to Blockchain </strong>: The Blockchain can not communicate via MQTT.So you need an Middleman, listening for bolckchain events and can send MQTT Messages as an Client.
                  You can use this Node red script for that: <a href="https://github.com">here</a></li>
                </ul>
               
              </>
            )
          },
        {
          title: "Creating an Organization",
          content: (
            <>
              <Paragraph>
                Users can create a new organization by providing a name. An organization represents a physical space, such as a building or a room, and helps in logically segregating IoT devices.
              </Paragraph>
              <Paragraph>Steps to Create an Organization:</Paragraph>
              <ul>
                <li>go th the <a href="/organizations">/organizations</a> Page</li>
                <li>Click on "Create New Organization".</li>
                <li>Enter the desired organization name.</li>
                <li>Manage organizations through the list that allows switching between multiple organizations.</li>
              </ul>
            </>
          )
        },
        {
          title: "User Roles in an Organization",
          content: (
            <>
              <Paragraph>
                When inviting new members to an organization, you can assign them either an Admin or User role.
                The User who gets inveted gets one specific NFT for this Organization.
              </Paragraph>
              <ul>
                <li><strong>Admin</strong>: Can manage devices (CRUD operations), invite new members, and manage the organization.</li>
                <li><strong>User</strong>: Can view devices and their actions, and pay for services.</li>
              </ul>
              <br></br>
              <Paragraph>Steps to Invite Users:</Paragraph>
              <ul>
                <li>go th the <a href="/organizations">/organizations</a> Page</li>
                <li>click on the edit Button from the organization</li>
                <li>Enter the wallet address of the user who should get invited </li>
                <li>select one of the two options "create User Organisation NFT" or "create Admin Organisation NFT"</li>
                <li>Users receive the NFT and can add themselves to the organization through clicking on the Button "Add Existing Organization" and paste the organization address which the Inventor has to tell them .</li>
                <li>This NFT determines their permissions within the organization.</li>
              </ul>
            </>
          )
        },
        {
          title: "Managing Devices and their Actions",
          content: (
            <>
              <Paragraph>Admins who own physical IoT devices can add and manage these devices within an organization.</Paragraph>
              <Paragraph>Steps to Add a Device:</Paragraph>
              <ul>
                <li>Navigate to the <a href="/devices">/devices</a> tab.</li>
                <li>Click on the <strong>+</strong> and enter the device's name.</li>
                <li>Devices can be categorized by the services they offer, such as a vacuum cleaner robot or a coffee machine.</li>
              </ul>
              <Paragraph>Configuring Actions:</Paragraph>
              <ul>
                <li>Within the "Actions" tab when clicking the device card, define the actions the device can perform.</li>
                <li>Specify the name of the action, the pricing model (e.g., per minute, per action), and the cost.</li>
                <li>Admins can update, delete, or modify actions as needed.</li>
              </ul>
            </>
          )
        },
        {
          title: "Using and Paying for Services",
          content: (
            <>
              <Paragraph>Users can view available devices and their actions within the organization.</Paragraph>
              <Paragraph>Steps to Use a Service:</Paragraph>
              <ul>
                <li>Select a device under the <a href="/devices">/devices</a> tab.</li>
                <li>click on one Device and you seee all the available actions</li>
                <li>Choose an action and pay using a Web3 wallet.</li>
                <li>The action is executed automatically upon payment, and the payment is transferred to the device owner's wallet.</li>
              </ul>
              <br></br>
              <br></br>
              <Paragraph>Starting a Fundraising Campaign:</Paragraph>
              <ul>
              <li>Select a device under the <a href="/devices">/devices</a> tab.</li>
              <li>click on one Device and you seee all the available actions</li>
              <li>click on action and you see the Field "create Campaign for make cat and share the cost"</li>
                
                
                <li>Define the description, the number of executions, and the time limit for the campaign.</li>
                <li>Other users can contribute to the campaign until the goal is reached.</li>
              </ul>
              <br></br>
              <br></br>
              <Paragraph>
                If the campaign goal is met within the time limit, the action is executed. Otherwise, the contributed funds are refunded to the users when clicking on the Button "End Campaign and refund all contributors".
              </Paragraph>
              <br></br>
              <br></br>
              <Paragraph>Contribute on Campaign:</Paragraph>
              <ul>
              <li>go to the  <a href="/campaigns">/campaigns</a> tab.</li>
              <li>click on the more button of one Campaign</li>
              <li>if the campaign is still Open you can Click on the Button "Contribute"</li>
                <li>after contributing yu can see the Campaign progress in the percentage process Bar.</li>
                <li>For more detailled information go to the Button "view donations"</li>
              </ul>
           
            </>
          )
        }
      ];
    
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
         
     
          <Card style={{ maxWidth: '800px', width: '100%' ,maxheight:'500px'}}>
            <Title level={2}>Platform User Guide</Title>
            <img style={{ maxWidth: '800px', width: '100%' }} src="/iot_payment_react.jpeg"></img>
            <List
              dataSource={sections}
              renderItem={(section, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={<Title level={4}>{section.title}</Title>}
                    description={section.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      );
};

export default WelcomePage;
