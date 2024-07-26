import React from 'react';
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navigation/Navbar";
import { Devices } from "./Device/Devices";
import { Actions } from "./Action/Actions";
import WelcomePage from "./WelcomePage"; 
import { Button, ConfigProvider, Space, Modal, Input } from "antd";
import { getRandomColors } from "./utils";
import CampaignList from './Campaign/CampaignList';
import CampaignDonations from './Campaign/CampaignDonations';

export default function App() {

  const [colors, setColors] = useState([]);

  useEffect(() => {
    const color = getRandomColors("blue");
    setColors(color);
   
  }, []);



    return (
        <div>
          <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(135deg, ${colors.join(", ")})`,
              colorPrimaryHover: `linear-gradient(135deg, ${colors.join(", ")})`,
              colorPrimaryActive: `linear-gradient(135deg, ${colors.join(", ")})`,
              lineWidth: 0,
            },
        

          },
        }}
      >
            <Navbar />
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/actions" element={<Actions />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/campaigns" element={<CampaignList />} />
                <Route path="/donations" element={<CampaignDonations />} />
            </Routes>
            </ConfigProvider>
        </div>
    );
}
