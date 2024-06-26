import React, { useState } from 'react';
import { Modal, Button, Input, Space, QRCode } from "antd";
import { Action, ActionFactory, FundRaising } from "../web3/contracts";
import { build } from 'eth-url-parser';

export const PaymentModal = ({ open, currrentAction, setOpen, eventcallback, setAlertMessage, setShowAlterMessage, setLoading }) => {
  const [campaignAmount, setCampaignAmount] = useState(1);
  const [campaignDuration, setCampaignDuration] = useState(3600);
  const action = new Action();
  const fundRaising = new FundRaising();
  const actionFactory=new ActionFactory();

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const payAction = async () => {
    setShowAlterMessage(false);
    await action.initialize(currrentAction.ActionAddress);
    await action.payActionInstant(currrentAction.price);
    setOpen(false);
    setLoading(true);
    setAlertMessage(`Action with Name: ${currrentAction.name} recieved payment`);
    actionFactory.setActionListenerPayed(eventcallback);
  };

  const payActionWithBalance = async () => {
    setShowAlterMessage(false);
    await action.initialize(currrentAction.ActionAddress);
    await action.payAction(1);
    setOpen(false);
    setLoading(true);
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
    setLoading(true);
    setAlertMessage(`Campaign for Action ${currrentAction.name} was created and is open for ${campaignDuration} seconds`);
    fundRaising.setCampaignListenerCreate(eventcallback)
  };

  function getActionPaymentUrl(){
    const url = build({
      scheme: 'ethereum',
      prefix: 'pay',
      target_address: currrentAction.ActionAddress,
      parameters: {
        'value': currrentAction.price, // (in WEI)
      }
    });
    return url;
  }

  return (
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <QRCode value={currrentAction ? getActionPaymentUrl() : ""} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Button type='primary' onClick={payAction}>Pay Action with Wallet</Button>
        <Button type='primary' onClick={payActionWithBalance}>Pay Action with Balance</Button>
      </div>

      <br /><hr /><br />

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
          placeholder="Duration in Seconds"
          onChange={(e) => {
            setCampaignDuration(e.target.value);
          }}
        ></Input>
        <Button type='primary' onClick={createCampaign}>Create Campaign</Button>
      </div>
    </Modal>
  );
};
