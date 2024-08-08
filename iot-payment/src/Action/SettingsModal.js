import React, { useState } from 'react';
import { Modal, Button, Input, Space, Tooltip } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ActionFactory } from "../web3/contracts";

export const SettingsModal = ({ open, currrentAction, setOpen, eventcallback, setAlertMessage, setShowAlterMessage, setLoading }) => {
  const [newPrice, setNewPrice] = useState(null);
  const [newName, setNewName] = useState(null);
  const [newUnit, setNewUnit] = useState(null);
  const actionFactory = new ActionFactory();

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const updateActionPrice = async () => {
    setShowAlterMessage(false);
    await actionFactory.initialize();
    await actionFactory.updateActionPrice(currrentAction.id, newPrice);
    setOpen(false);
    setLoading(true);
    setAlertMessage(`Action with Name ${currrentAction.name} was updated to new Price ${newPrice}`);
    actionFactory.setActionListenerUpdate(eventcallback);
  };

  const updateActionName = async () => {
    setShowAlterMessage(false);
    await actionFactory.initialize();
    await actionFactory.updateActionName(currrentAction.id, newName);
    setOpen(false);
    setLoading(true);
    setAlertMessage(`Action: ${currrentAction.name} was updated to:  ${newName}`);
    actionFactory.setActionListenerUpdate(eventcallback);
  };

  const updateActionUnit = async () => {
    setShowAlterMessage(false);
    await actionFactory.initialize();
    await actionFactory.updateActionUnit(currrentAction.id, newUnit);
    setOpen(false);
    setLoading(true);
    setAlertMessage(`Action with Name: ${currrentAction.name} was updated to new Unit: ${newUnit}`);
    actionFactory.setActionListenerUpdate(eventcallback);
  };

  const deletAction = async () => {
    setShowAlterMessage(false);
    await actionFactory.initialize();
    await actionFactory.deleteAction(currrentAction.id);
    setOpen(false);
    setLoading(true);
    setAlertMessage(`Action with Name: ${currrentAction.name} was deleted`);
    actionFactory.setActionListenerDelete(eventcallback);
  };

  return (
    <Modal
      title={currrentAction.name}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3>Device Name: </h3>
          <Tooltip title="Enter the new name for the action">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
        <Space style={{ width: "150%" }}>
          <Input
            placeholder="Enter new Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="primary" onClick={updateActionName}> Set New Name</Button>
        </Space>
        <br /><br />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3>Billing unit:</h3>
          <Tooltip title="Enter the new billing unit">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
        <Space style={{ width: "150%" }}>
          <Input
            placeholder="Enter new Unit"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
          />
          <Button type="primary" onClick={updateActionUnit}> Set New Unit</Button>
        </Space>
        <br /><br />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3>Device Price:</h3>
          <Tooltip title="Enter the new price for the action">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
        <Space style={{ width: "150%" }}>
          <Input
            placeholder="Enter new Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <Button type='primary' onClick={updateActionPrice}> Set New Price</Button>
        </Space>
        <br /><br />

        <Button onClick={deletAction} danger> Delete Action </Button>
      </div>
    </Modal>
  );
};
