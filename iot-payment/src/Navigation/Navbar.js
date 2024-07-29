import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Space, Modal, Input, Divider } from "antd";
import { Balance } from "../web3/contracts";
import { UsernameRegistry } from "../web3/contracts";
import OrganizationsDrawer from "./OrganizationsDrawer";

export default function Navbar() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  const balance = new Balance();
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

  async function getBalance() {
    await balance.initialize();
    const balanceValue = await balance.getBalance(signer.address);
    setUserBalance(balanceValue);
  }

  async function deposit() {
    await balance.initialize();
    await balance.deposit(depositAmount);
    await getBalance();
  }

  async function withdraw() {
    await balance.initialize();
    await balance.withdraw(withdrawAmount);
    await getBalance();
  }

  async function getUsername() {
    await usernameRegistry.initialize();
    const userAddress = signer ? signer.address : "";
    const fetchedUsername = await usernameRegistry.getUsername(userAddress);
    if (fetchedUsername!="") {
      setUsername(fetchedUsername);
      setIsUsernameSet(true);
    } else {
      setIsModalOpen(true);
    }
    localStorage.userName=fetchedUsername;
  }

  async function updateUsername(newUsername) {
    await usernameRegistry.initialize();
    if (isUsernameSet){
      await usernameRegistry.updateUsername(newUsername);
    }
    else{
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
      getBalance();
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
          Organization: {localStorage.getItem("orgname") ? localStorage.getItem("orgname") : "No Organization selected"}
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
              {`${username} - ${userBalance} ETH`}
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
            <Space direction="vertical" style={{ width: "100%" }}>
              <Divider />
              <h4>Enter Deposit Amount</h4>
              <Input
                placeholder="Amount to deposit"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <Button type="primary" onClick={deposit}>
                Deposit
              </Button>
              <Divider />
              <h4>Enter Withdraw Amount</h4>
              <Input
                placeholder="Amount to withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <Button type="primary" onClick={withdraw}>
                Withdraw
              </Button>
              <Divider />
            </Space>
          
          </Modal>
        </div>
      </div>
    </>
  );
}
