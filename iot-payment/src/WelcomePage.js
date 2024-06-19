import React, { useState ,useRef} from 'react';
import { Button, Typography, Divider,Tour,TourProps } from 'antd';
import { Link } from 'react-router-dom';
import CampaignList from './CampaignList';
import OrganizationsDrawer from './Navigation/OrganizationsDrawer';

const { Title, Paragraph } = Typography;

const WelcomePage = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setDrawerVisible(false);
    };
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
  
    const [open, setOpen] = useState(false)
    
    const steps= [
        {
          title: 'Upload File',
          description: 'Put your files here.',
          cover: (
            <img
              alt="tour.png"
              src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            />
          ),
          target: () => ref1.current,
        },
        {
          title: 'Save',
          description: 'Save your changes.',
          target: () => ref2.current,
        },
        {
          title: 'Other Actions',
          description: 'Click to see other actions.',
          target: () => ref3.current,
        },
      ];



    return (
        <div style={{ padding: '20px' }}>
            <Title>Welcome to Our Platform!</Title>

            <Divider />

            <Paragraph>
                Here, you can manage your devices, create actions, and participate in fundraising campaigns.
                Let's explore the features step by step:
            </Paragraph>

            <Divider orientation="left">Organizations Drawer</Divider>
            <Paragraph>
                The Organizations Drawer allows you to manage organizations. You can create new organizations, add existing ones, and select an organization to work with.
            </Paragraph>
            <Button onClick={handleDrawerOpen}>Click here to open the Organizations Drawer.</Button>

            <OrganizationsDrawer
                placement="left"
                onClose={handleDrawerClose}
                open={drawerVisible}
                setOpen={setDrawerVisible}
            />
            <Divider orientation="left">Devices</Divider>
            <Paragraph>
            <div className="welcome-container">
            <h1>Empower Your IoT Experience</h1>
            <p>
                Our platform bridges the gap between IoT device owners and users who wish to leverage the capabilities of these devices. 
                Whether you are a device owner looking to offer services or a user seeking to benefit from the latest IoT technology, 
                our system caters to your needs.
            </p>

            <section className="device-owners">
                <h2>For IoT Device Owners</h2>
                <ul>
                    <li><strong>Register Your Devices:</strong> Easily add your IoT devices to our platform.</li>
                    <li><strong>Define Actions:</strong> Specify the actions your devices can perform. Each action can have a unique name, billing unit, and price.</li>
                    <li><strong>Manage Your Devices and Actions:</strong> Utilize full CRUD (Create, Read, Update, Delete) operations to maintain your devices and actions. This includes updating prices, adding new actions, and removing outdated ones.</li>
                    <li><strong>Add Images:</strong> Enhance your device and action listings by adding images, making it easier for users to understand what you offer.</li>
                    <li><strong>Organize Devices:</strong> Create logical groups or organizations for better management and visibility control. Restrict access to certain user groups and maintain an organized structure.</li>
                    <li><strong>Assign Roles:</strong> Within your organizations, designate admin users who can add devices and regular users who can view them.</li>
                </ul>
            </section>

            <section className="service-users">
                <h2>For IoT Service Users</h2>
                <ul>
                    <li><strong>Explore Devices and Actions:</strong> Browse through available devices and their actions within the organizations you have access to.</li>
                    <li><strong>Join Organizations:</strong> Create or join organizations. Invite others and assign roles to manage access and permissions effectively.</li>
                    <li><strong>Manage Your Balance:</strong> Keep track of your account balance, deposit funds, and make payments seamlessly.</li>
                    <li><strong>Utilize Services:</strong> Select and pay for device actions using your account balance or direct payment methods. Ensure the execution of the desired action with secure transactions.</li>
                    <li><strong>Participate in Fundraising:</strong> Contribute to fundraising efforts for actions that benefit the entire organization. Pledge any amount you wish, and if the goal is met within the specified time, the action will be executed. If not, your contributions will be refunded.</li>
                </ul>
            </section>
        </div>
            </Paragraph>
            <Button onClick={handleDrawerOpen}>Click here to open the Organizations Drawer.</Button>

           

            <Divider orientation="left">Campaign List</Divider>
            <Paragraph>
                The Campaign List displays ongoing fundraising campaigns associated with your selected organization. You can contribute funds to campaigns, view details, and manage campaign actions.
                Click <Link to="/">here</Link> to see the Campaign List.
            </Paragraph>
            <Tour open={open} onClose={() => setOpen(false)} steps={steps} />

        </div>
    );
};

export default WelcomePage;
