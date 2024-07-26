import React, { useState } from 'react';
import { Modal, Button, Input, Space, QRCode, Tooltip } from "antd";
import { Action, ActionFactory, FundRaising } from "../web3/contracts";
import { build } from 'eth-url-parser';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const PaymentModal = ({ open, currrentAction, setOpen, eventcallback, setAlertMessage, setShowAlterMessage, setLoading }) => {
  const [campaignAmount, setCampaignAmount] = useState(1);
  const [campaignDuration, setCampaignDuration] = useState(3600);
  const [campaignDescription,setCampaignDescription]=useState("");
  const action = new Action();
  const fundRaising = new FundRaising();
  const actionFactory = new ActionFactory();

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
    setAlertMessage(`Action with Name: ${currrentAction.name} received payment`);
    actionFactory.setActionListenerPayed(eventcallback);
  };

  const payActionWithBalance = async () => {
    setShowAlterMessage(false);
    await action.initialize(currrentAction.ActionAddress);
    await action.payAction(1);
    setOpen(false);
    setLoading(true);
    setAlertMessage(`Action with Name: ${currrentAction.name} received payment from Balance`);
    actionFactory.setActionListenerPayed(eventcallback);
  };

  const createCampaign = async () => {
    setShowAlterMessage(false);
    await fundRaising.initialize();
    await fundRaising.createCampaign(
      (currrentAction.name+" : "+campaignDescription),
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

  function getActionPaymentUrl() {
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
      title={
        <span>
          Pay the Action {currrentAction.name}
          <Tooltip title='This action allows you to make a payment for the specified action. For this you have three options.
          The first is to pay the Action with your web3 wallet (MetaMask).For this you can use your Chrome extension or pay with the QR Code.
          The second option is to pay with
          the Platform Balance.In this to cases the specific Action gets triggered instantly. If you use the third option and create an campaign, every person in this Organisation can pay an Amount he wants and the Action performs if the 
          Price for the given Action is reached.'>
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </span>
      }
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
      <br />
      <br />


      <h3>Pay full Amount of {currrentAction.name} ({(currrentAction.price).toString()}) to perform instantly: </h3>
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
      <h3>create Campaign for  {currrentAction.name}  and share the cost: </h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <Input
          placeholder="Description of Campaign"
          onChange={(e) => {
            setCampaignDescription(e.target.value);
          }}
        ></Input>
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
