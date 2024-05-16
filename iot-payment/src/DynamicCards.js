import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { configConsumerProps } from "antd/es/config-provider";
import { useLocation } from "react-router-dom";
import { Modal, Button, Input, Space, QRCode,ConfigProvider } from "antd";
import { Device ,Action,ActionFactory} from "./web3/contracts";
import { splititemsIntoGroups,getRandomColors } from "./utils";
import { accessListify } from "ethers";




export function DynamicCardsAction({ items }) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [newPrice, setNewPrice] = useState(null);
  const [currrentAction,setCurrentAction]=useState(null);

  const action =new Action();
  const actionFactory=new ActionFactory();

  async function handleCardClick(entry) {
    setCurrentAction(entry);
    await action.initialize(entry.ActionAddress);
    console.log("possible executions"+await action.possibleActionsAmount())
  
    setOpen(true);
  }
  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const setPrice= async() => {
    
    await actionFactory.initialize();
    await actionFactory.updateActionPrice(currrentAction.id,newPrice);
  }


  return (
    <div>
      <Modal
        title="Action Info"
        open={open}
        onOk={setPrice}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="set new Price "
      >
        <br></br>
        {currrentAction?currrentAction.ActionAddress:<></>}
        <br></br>
        <br></br>
        <Input
          placeholder="E.nter new Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        
      </Modal>

      {splititemsIntoGroups(items).map((group, index) => (
        <div>
          <Row key={index} gutter={16} justify="center">
            {group.map((entry) => (
              <Col span={8} key={entry.id}>
                <Card
                  hoverable
                  title={entry.name}
                  bordered={true}
                  onClick={() => {
                    handleCardClick(entry);
                  }}
                >
                  <div>
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {entry.price.toString()}{" "}
                    </span>
                    <spa> for one </spa>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {entry.unit}
                    </span>
                  </div>
                  <div>{entry.ActionAddress}</div>
                </Card>
              </Col>
            ))}
          </Row>
          <br></br>
          <br></br>
        </div>
      ))}
    </div>
  );
}

export function DynamicCardsDevice({ items }) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [depositAmount, setDepositAmount] = useState("");
  const [currentDevice, setCurrentDevice] = useState(null);
  const [userbalance,setUserBalance]=useState(null);
  const [deviceBalance,setDeviceBalance]=useState(null);



  const device= new Device(); 

  async function initializeContract(){
    await device.initialize(currentDevice.deviceAddress); 
    
  }


  useEffect(()=>{
 
    if (currentDevice)
   initializeContract();
  },[currentDevice])


  function handleCardClick(entry) {
    setCurrentDevice(entry);
    toActions(entry);
  }
  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 500);
    toActions();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  function toActions(entry) {
    navigate("/actions", {
      state: {
        deviceAddress: entry.deviceAddress,
        deviceName: entry.name,
        deviceId: entry.id,
      },
    });
  }

  const sendFunds=async()=>{
  
    await device.initialize(currentDevice.deviceAddress);
    await device.sendFunds(depositAmount);
  }



  return (
    <div>
      

      {splititemsIntoGroups(items).map((group, index) => (
        <div>
          <Row key={index} gutter={16} justify="center">
            {group.map((entry) => (

              <Col span={8} key={entry.id}>
               
                <Card
                cover={
                  <div style={{
                    backgroundImage: `linear-gradient(135deg, ${getRandomColors("purple").join(', ')})`, // Example colors
                    height: '70px', // Adjust the height as needed
                  }}></div>
                }
                  hoverable
                  title={entry.name}
                  bordered={true}
                  onClick={() => {
                    handleCardClick(entry);
                  }}
                >
                  {entry.deviceAddress}
                </Card>
              </Col>
            ))}
          </Row>
          <br></br>
          <br></br>
        </div>
      ))}
    </div>
  );
}
