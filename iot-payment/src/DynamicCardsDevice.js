import React, { useEffect, useState } from "react";
import { Card, Col, Row, Modal, Button,Input,Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Device, DeviceFactory } from "./web3/contracts"; // Adjust the import according to your project structure
import { splititemsIntoGroups, getRandomColors } from "./utils"; // Ensure these utilities are defined

export function DynamicCardsDevice({ items, eventcallback,setAlertMessage,setShowAlterMessage }) {
  const [currentDevice, setCurrentDevice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newDeviceName,setNewDeviceName]=useState(null);

  const device = new Device();
  const deviceFactory = new DeviceFactory();

  async function initializeContract() {
    await device.initialize(currentDevice.deviceAddress);
  }

  useEffect(() => {
    if (currentDevice) initializeContract();
  }, [currentDevice]);

  function handleCardClick(entry) {
    setCurrentDevice(entry);
    toActions(entry);
  }

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

  const handleMoreClick = (e, entry) => {
    e.stopPropagation(); // Prevents the card click event from being triggered
    setCurrentDevice(entry);
    setOpenModal(true);
  };

  const handleOk = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const deleteDevice = async () => {
    setShowAlterMessage(false);
    await deviceFactory.initialize();
    await deviceFactory.deleteDevice(currentDevice.id);
    setAlertMessage(`${currentDevice.name} was deleted`);
    deviceFactory.setDeviceListenerDelete(eventcallback);
    setOpenModal(false);
  };
  
  const updateDeviceName = async () => {
    await deviceFactory.initialize();
    await deviceFactory.updateDeviceName(currentDevice.id,newDeviceName);
    deviceFactory.setDeviceListener();
    setOpenModal(false);
  };
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div>
      {splititemsIntoGroups(items).map((group, index) => (
        <div key={index}>
          <Row gutter={16} justify="center">
            {group.map((entry) => (
              <Col span={8} key={entry.id}>
                <Card
                  extra={<a onClick={(e) => handleMoreClick(e, entry)}>More</a>}
                  cover={
                    <div
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${getRandomColors(
                          "purple"
                        ).join(", ")})`, // Example colors
                        height: "70px", // Adjust the height as needed
                      }}
                    ></div>
                  }
                  hoverable
                  title={entry.name}
                  bordered={true}
                  onClick={() => handleCardClick(entry)}
                ></Card>
              </Col>
            ))}
          </Row>
          <br></br>
          <br></br>
        </div>
      ))}

      {currentDevice && (
        <Modal visible={openModal} onOk={handleOk} onCancel={handleCancel}>
          <h2>{currentDevice.name}</h2>
          <p>Device Address: {currentDevice.deviceAddress}</p>

            <Space>
          <Input
            placeholder="Enter the new Device Name"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
          />
          <Button type="primary"  onClick={updateDeviceName}>set New Device Name</Button>
          </Space>
            <br></br>
            <br></br>
          {isAdmin ? (
            <Button type="primary" onClick={deleteDevice} danger>
              Delete {currentDevice.name}
            </Button>
          ) : (
            <></>
          )}
        </Modal>
      )}
    </div>
  );
}

export default DynamicCardsDevice;
