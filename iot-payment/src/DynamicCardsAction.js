import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { Modal, Button, Input, Space, QRCode, ConfigProvider } from "antd";
import { Device, Action, ActionFactory, FundRaising } from "./web3/contracts";
import { splititemsIntoGroups, getRandomColors } from "./utils";

export function DynamicCardsAction({ items,eventcallback,setAlertMessage,setShowAlterMessage }) {
  const [open, setOpen] = useState(false);
  const [newPrice, setNewPrice] = useState(null);
  const [newName, setNewName] = useState(null);
  const [newUnit, setNewUnit] = useState(null);
  const [currrentAction, setCurrentAction] = useState(null);
  const [campaignAmount, setCampaignAmount] = useState(1);
  const [campaignDuration, setCampaignDuration] = useState(3600);

  const action = new Action();
  const actionFactory = new ActionFactory();
  const fundRaising = new FundRaising();

  async function handleCardClick(entry) {
    setCurrentAction(entry);
    await action.initialize(entry.ActionAddress);
    console.log(entry.organisationAddress);
    setOpen(true);
  }
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
    setAlertMessage(`Action with Name ${currrentAction.name} was updated to new Price ${newPrice}`);
    actionFactory.setActionListenerUpdate(eventcallback);
  };
  const updateActionName = async () => {
    setShowAlterMessage(false);
    await actionFactory.initialize();
    await actionFactory.updateActionName(currrentAction.id, newName);
    setOpen(false);
    setAlertMessage(`Action: ${currrentAction.name} was updated to:  ${newName}`);
    actionFactory.setActionListenerUpdate(eventcallback);
  };

  const updateActionUnit = async () => {
    setShowAlterMessage(false);
    await actionFactory.initialize();
    await actionFactory.updateActionUnit(currrentAction.id, newUnit);
    setOpen(false);
    setAlertMessage(`Action with Name: ${currrentAction.name} was updated to new Unit: ${newUnit}`);
    actionFactory.setActionListenerUpdate(eventcallback);
  };

  const deletAction = async () => {
    setShowAlterMessage(false);
    await actionFactory.initialize();
    await actionFactory.deleteAction(currrentAction.id);
    setOpen(false);
    setAlertMessage(`Action with Name: ${currrentAction.name} was deleted`);
    actionFactory.setActionListenerDelete(eventcallback);
  };
  const payAction = async () => {
    setShowAlterMessage(false);
    await action.initialize(currrentAction.ActionAddress);
    await action.payActionInstant(currrentAction.price);
    setOpen(false);
    setAlertMessage(`Action with Name: ${currrentAction.name} recieved payment`);
    actionFactory.setActionListenerPayed(eventcallback);
  };

  const payActionWithBalance = async () => {
    setShowAlterMessage(false);
    await action.initialize(currrentAction.ActionAddress);
    await action.payAction(1);
    setOpen(false);
    setAlertMessage(`Action with Name: ${currrentAction.name} recieved payment from Balance`);
    actionFactory.setActionListenerPayed(eventcallback);
  };

  const createCampaign = async () => {
    setShowAlterMessage(false);
    await fundRaising.initialize();
    await fundRaising.createCampaign(
      currrentAction.name,
      currrentAction.organisationAddress,
      currrentAction.ActionAddress,
      campaignDuration,
      campaignAmount
    );
    setOpen(false);
    setAlertMessage(`Campaign for Action ${currrentAction.name} was created and is open for ${campaignDuration} sekonds`);
    fundRaising.setCampaignListenerCreate(eventcallback)
  };

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div>
      {currrentAction ? (
        <Modal
          title={currrentAction.name}
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {currrentAction ? (
            "Action Address: " + currrentAction.ActionAddress
          ) : (
            <></>
          )}
          <br />
          <br />
          {isAdmin ? (
            <div>
             
              
              <Space style={{ width: "150%" }}>
                <Input
                  placeholder="Enter new Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Button type="primary" onClick={ updateActionName}> Set New Name</Button>
              </Space>
              <br></br>
              <br></br>
              <Space style={{ width: "150%" }}>
                <Input
                  placeholder="Enter new Unit"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                />
                <Button type="primary" onClick={ updateActionUnit}> set new Unit</Button>
              </Space>
              <br></br><br></br>
              <Space style={{ width: "150%" }}>
              <Input
                placeholder="Enter new Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
                <Button onClick={updateActionPrice}>set New Price</Button>
              </Space>
              <br></br><br></br>
              <Button onClick={deletAction} danger> Delete Action </Button>
            </div>
          ) : (
            <></>
          )}

          <br></br>
          <br></br>
          <hr></hr>

          <br></br>
          <div></div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <QRCode
              value={currrentAction ? currrentAction.ActionAddress : ""}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button onClick={payAction}>Pay Action with Wallet</Button>
            <Button onClick={payActionWithBalance}>
              Pay Action with Balance
            </Button>
          </div>

          <br></br>
          <hr></hr>
          <br></br>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Input
              placeholder="Amount of Actions"
              onChange={(e) => {
                setCampaignAmount(e.target.value);
              }}
            ></Input>
            <Input
              placeholder="duration in Seconds"
              onChange={(e) => {
                setCampaignDuration(e.target.value);
              }}
            ></Input>
            <Button onClick={createCampaign}>Create Campaign</Button>
          </div>

          <br></br>
        </Modal>
      ) : (
        <></>
      )}

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