

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, ConfigProvider, Space, Modal, Input } from "antd";
import { TinyColor } from "@ctrl/tinycolor";
import { getRandomColors } from "../utils";
import { Balance } from "../web3/contracts";
import OrganizationsDrawer from "./OrganizationsDrawer"; // Importiere die Drawer-Komponente

export default function Navbar() {
  const [provider, setPorvider] = useState(null);
const [signer, setSigner] = useState(null);
const [colors, setColors] = useState([]);
const [userBalance, setUserBalance] = useState(0);
const [depositAmount,setDepositAmount]=useState(0);
const [withdrawAmount,setWithdrawAmount]=useState(userBalance);

const balance = new Balance();

const [isModalOpen, setIsModalOpen] = useState(false);
const [open, setOpen] = useState(false);
const [placement, setPlacement] = useState('left');

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
  setWithdrawAmount(userBalance);
};

const handleOk = () => {
  setIsModalOpen(false);
};

const handleCancel = () => {
  setIsModalOpen(false);
};

async function setupwallet() {
  const provider = new ethers.BrowserProvider(window.ethereum, "any");
  setPorvider(provider);
  setSigner(await provider.getSigner());
}

async function getBalance() {
  await balance.initialize();
  setUserBalance(await balance.getBalance());
  
}
async function deposit(){
  await balance.initialize();
  await balance.deposit(depositAmount);
}
async function withdraw(){
  await balance.initialize();
  await balance.withdraw(withdrawAmount);
}

useEffect(() => {
  setupwallet();
  const color = getRandomColors("blue");
  setColors(color);
  getBalance();
}, []);


  return (
    <>
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
        <OrganizationsDrawer
          placement={placement}
          onClose={onClose}
          open={open}
          setOpen={setOpen}
        />
        <div style={{
          position: "absolute",
          top: 30,
          left: 30,
          marginRight: "20px",
          color: "black",
        }}>
          <Button type="primary" shape="round" onClick={showDrawer}>Organization : {localStorage.getItem("orgname")?localStorage.getItem("orgname"):"No Organization selected"}</Button>
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
            <Button type="primary" shape="round" onClick={showModal}>
              Balance: {userBalance}
            </Button>
            <Modal
              title={signer ? signer.address : ""}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <br></br>
              <Space.Compact
                style={{
                  width: "100%",
                }}
              >
                <Input
                  placeholder="Amount to deposit for subscription"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button type="primary" onClick={deposit} justify="center">
                  Deposit {depositAmount}
                </Button>
              </Space.Compact>
              <br></br>
              <br></br>
              <Space.Compact
                style={{
                  width: "100%",
                }}
              >
                <Input
                  placeholder="Amount to withdraw for subscription"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Button type="primary" onClick={withdraw} justify="center">
                  Withdraw {withdrawAmount}
                </Button>
              </Space.Compact>
            </Modal>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}



