import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Space, Modal, Input, Divider } from "antd";
import { Balance } from "../web3/contracts";
import { UsernameRegistry } from "../web3/contracts";
import OrganizationsDrawer from "./OrganizationsDrawer";
import { MenuOutlined } from "@ant-design/icons";

export default function Navbar() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  const usernameRegistry = new UsernameRegistry(provider);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function setupWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    setProvider(provider);
    const signer = await provider.getSigner();
    setSigner(signer);
  }

  async function getUsername() {
    await usernameRegistry.initialize();
    const userAddress = signer ? signer.address : "";
    const fetchedUsername = await usernameRegistry.getUsername(userAddress);
    if (fetchedUsername != "") {
      setUsername(fetchedUsername);
      setIsUsernameSet(true);
    } else {
      setIsModalOpen(true);
    }
    localStorage.userName = fetchedUsername;
  }

  async function updateUsername(newUsername) {
    await usernameRegistry.initialize();
    if (localStorage.userName != "") {
      console.log(localStorage.userName);
      await usernameRegistry.updateUsername(newUsername);
    } else {
      console.log(localStorage.userName);
      await usernameRegistry.createUsername(newUsername);
    }
    setUsername(newUsername);
    setIsUsernameSet(true);
    setIsModalOpen(false);
  }

  useEffect(() => {
    setupWallet();
  }, []);

  useEffect(() => {
    if (signer) {
      getUsername();
    }
  }, [signer]);

  return (
    <>
      <OrganizationsDrawer
        placement={placement}
        onClose={onClose}
        open={open}
        setOpen={setOpen}
        username={username}
      />
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          marginRight: "20px",
          color: "black",
        }}
      >
        <Button type="primary" shape="round" onClick={showDrawer}>
          <MenuOutlined />
        </Button>
      </div>
      <div style={{ backgroundColor: "", height: "100px", zIndex: 1 }}>
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 30,
            marginRight: "20px",
            color: "black",
          }}
        >
          {isUsernameSet && (
            <Button type="primary" shape="round" onClick={showModal}>
              {`${username} `}
            </Button>
          )}
          {!isUsernameSet && (
            <Button type="primary" shape="round" onClick={showModal}>
              Set Username
            </Button>
          )}
          <Modal
            title={`Set Username for ${signer ? signer.address : ""}`}
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <h3>Username Settings</h3>
            <Space>
              <Input
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button type="primary" onClick={() => updateUsername(username)}>
                Set New Username
              </Button>
            </Space>
            <br />
          </Modal>
        </div>
      </div>
    </>
  );
}
