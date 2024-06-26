import { useEffect, useState } from "react";
import { ActionFactory, Device } from "../web3/contracts";
import React from "react";
import { Button, Modal, Input, Alert,FloatButton,Spin } from "antd";
import { DynamicCardsAction } from "./DynamicCardsAction";
import { useLocation } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import { getRandomColors } from "../utils";


export function Actions() {
  const device = useLocation().state;

  const [actions, setActions] = useState([]);
  const [colors, setColors] = useState([]);


  const [actionName, setActionName] = useState("");
  const [actionPrice, setActionPrice] = useState("");
  const [actionunit, setActionUnit] = useState("");

  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlertMessage,setShowAlterMessage]=useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const actionFactory = new ActionFactory();
  const deviceContract = new Device();

  const getActions=async ()=>{
    await actionFactory.initialize();
    setActions(await actionFactory.getActions(device.deviceAddress));
   
  }
  const eventcallback = async () => {
    getActions();
    setShowAlterMessage(true);
    setLoading(false);
};


  useEffect(() => {
    getActions();
    const color = getRandomColors("green");
    setColors(color);
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await addAction();
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const addAction = async () => {
    try {
      await deviceContract.initialize(device.deviceAddress);
      await deviceContract.addAction(actionName, actionunit, actionPrice);
      await actionFactory.initialize();
      setAlertMessage(`Action ${actionName} was created`);
      setLoading(true);
      actionFactory.setActionListenerCreate(eventcallback);

    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (

    <div>
      <h2 style={{textAlign: "center"}}>All Actions from Device: {device.deviceName}</h2>
        <div style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
                {loading && <Spin size="large" />}
            </div>
      {showAlertMessage ? (
        <>
          <Alert
            message={alertMessage}
            type="success"
            closable
            showIcon
          />{" "}
          <br></br>{" "}
        </>
      ) : null}
         <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', padding: '20px' }}></div>
      <Modal
        title="Create New Action"
        visible={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Create New Action"
      >
        <br></br>
        <br></br>
        <Input
          placeholder="Enter the new Action Name"
          value={actionName}
          onChange={(e) => setActionName(e.target.value)}
        />
        <br></br>
        <br></br>
        <Input
          placeholder="Enter the new Action Unit"
          value={actionunit}
          onChange={(e) => setActionUnit(e.target.value)}
        />
        <br></br>
        <br></br>
        <Input
          placeholder="Enter the new Action Price per Unit"
          value={actionPrice}
          onChange={(e) => setActionPrice(e.target.value)}
        />
        <br></br>
        <br></br>
      </Modal>
      <div>
        <DynamicCardsAction items={actions} eventcallback={eventcallback} setAlertMessage={setAlertMessage} setShowAlterMessage={setShowAlterMessage} setLoading={setLoading}/>
      </div>
      {isAdmin ? (
         <FloatButton 
         onClick={showModal} 
            type='dashed'
         tooltip={<div>Add new Action</div> } 
         icon={<PlusOutlined />} 
         style={{ 
           width: '60px', 
           height: '60px', 
           fontSize: '30px', 
           background: `linear-gradient(135deg, ${colors.join(", ")})`, 
         }} 
       />
      ) : (
        <></>
      )}
    
      
    </div>
    
  );
}
