import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navigation/Navbar";
import { Devices } from "./Device/Devices";
import { Actions } from "./Action/Actions";
import WelcomePage from "./WelcomePage";
import { ConfigProvider ,Layout} from "antd";
import { getRandomColors } from "./utils";
import CampaignList from "./Campaign/CampaignList";
import CampaignDonations from "./Campaign/CampaignDonations";
import OrganizationsPage from "./Organisation/OrganizationsPage";
import MetaMaskNotFound from "./MetaMaskNotFound";

export default function App() {
  const [colors, setColors] = useState([]);
  const [metaMaskInstalled, setMetaMaskInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Neuer Zustand

  useEffect(() => {
    const color = getRandomColors("blue");
    setColors(color);
    
    if (typeof window.ethereum !== "undefined") {
      setMetaMaskInstalled(true);
    }
    setIsLoading(false); // Beende das Laden nach der Überprüfung
  }, []);

  // Ladezustand anzeigen
  if (isLoading) {
    return <div></div>; // Ladeanimation oder Ladeanzeige hier
  }

  return (
    <div>
      
      {metaMaskInstalled ? (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: `linear-gradient(135deg, ${colors.join(", ")})`,
                colorPrimaryHover: `linear-gradient(135deg, ${colors.join(
                  ", "
                )})`,
                colorPrimaryActive: `linear-gradient(135deg, ${colors.join(
                  ", "
                )})`,
                lineWidth: 0,
              },
            },
          }}
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/donations" element={<CampaignDonations />} />
          </Routes>
        </ConfigProvider>
      ) : (
        <MetaMaskNotFound />
      )}
    </div>
  );
}
