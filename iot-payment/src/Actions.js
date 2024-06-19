import { useEffect, useState } from "react";
import { ActionFactory, Device } from "./web3/contracts";
import React from "react";
import { Button, Modal, Input, Alert } from "antd";
import { DynamicCardsAction } from "./DynamicCardsAction";
import { useLocation } from "react-router-dom";

export function Actions() {
  const device = useLocation().state;

  const [actions, setActions] = useState([]);

  const [actionName, setActionName] = useState("");
  const [actionPrice, setActionPrice] = useState("");
  const [actionunit, setActionUnit] = useState("");

  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlertMessage,setShowAlterMessage]=useState(false);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const actionFactory = new ActionFactory();
  const deviceContract = new Device();

  const getActions=async ()=>{
    await actionFactory.initialize();
    setActions(await actionFactory.getActions(device.deviceAddress));
   
  }
  const eventcallback = async () => {
    getActions();
    setShowAlterMessage(true);
};


  useEffect(() => {
    getActions();
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
      actionFactory.setActionListenerCreate(eventcallback);

    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div>
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
      {isAdmin ? (
        <Button type="primary" onClick={showModal}>
          Create New Action
        </Button>
      ) : (
        <></>
      )}

      <Modal
        title="Create New Action"
        visible={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Create New Action"
      >
        <Input
          placeholder="Enter the new Action Name"
          value={actionName}
          onChange={(e) => setActionName(e.target.value)}
        />
        <br></br>
        <Input
          placeholder="Enter the new Action Unit"
          value={actionunit}
          onChange={(e) => setActionUnit(e.target.value)}
        />
        <br></br>
        <Input
          placeholder="Enter the new Action Price per Unit"
          value={actionPrice}
          onChange={(e) => setActionPrice(e.target.value)}
        />
        <br></br>
      </Modal>
      <div>
        <DynamicCardsAction items={actions} eventcallback={eventcallback} setAlertMessage={setAlertMessage} setShowAlterMessage={setShowAlterMessage} />
      </div>
    </div>
  );
}
