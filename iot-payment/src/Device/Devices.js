import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Alert, FloatButton, Spin } from 'antd';
import { DeviceFactory } from '../web3/contracts';
import { DynamicCardsDevice } from "./DynamicCardsDevice";
import { PlusOutlined } from '@ant-design/icons';
import { getRandomColors } from "../utils";

export function Devices() {
    const [devices, setDevices] = useState([]);
    const [deviceName, setDeviceName] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [showAlertMessage, setShowAlterMessage] = useState(false);
    const [deviceInstance, setDeviceInstance] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [showInfoScreen, setShowInfoScreen] = useState(false);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(false);

    const deviceFactory = new DeviceFactory();

    const getDevices = async () => {
        try {
            const fetchedDevices = await deviceFactory.getDevices();
            setDevices(fetchedDevices);
        } catch (e) {
            if (e.message.includes("no data present") || !localStorage.orgaddresse) {
                setShowInfoScreen(true);
            }
        }
    };

    const eventcallback = async () => {
        await getDevices();
        setShowAlterMessage(true);
        setLoading(false);
    };

    const initializeDeviceFactory = async () => {
        await deviceFactory.initialize();
        setDeviceInstance(deviceFactory);
        setInitialized(true);
        try {
            await getDevices();
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    useEffect(() => {
        initializeDeviceFactory();
        const color = getRandomColors("green");
        setColors(color);
    }, [alertMessage, localStorage.orgaddresse]);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        await addDevice();
        setOpen(false);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const addDevice = async () => {
        
        try {
            await deviceInstance.addDevice(deviceName);
            setLoading(true);
            setAlertMessage(`${deviceName} was created`);
            deviceInstance.setDeviceListenerCreate(eventcallback);
        } catch (error) {
            console.error('Error adding device:', error);
            setLoading(false); // stop loading in case of error
        }
    };

    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return (
        <div>
            <h2 style={{textAlign: "center"}}>All Devices from Organization: <span>{localStorage.orgname}</span></h2>
            <div style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
                {loading && <Spin size="large" />}
            </div>
            {!showInfoScreen ? (
                <> 
                    <div>
                        {showAlertMessage ? (
                            <>
                                <Alert message={alertMessage} type="success" closable showIcon />
                                <br />
                            </>
                        ) : null}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', padding: '20px' }}></div>
                        <Modal
                            title="Create New Device"
                            visible={open}
                            onOk={handleOk}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                            okText="Create New Device"
                        >
                            <Input
                                placeholder="Enter the new Device Name"
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                            />
                        </Modal>
                        <div>
                            <DynamicCardsDevice items={devices} eventcallback={eventcallback} setAlertMessage={setAlertMessage} setShowAlterMessage={setShowAlterMessage} setLoading={setLoading}/>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2>Sie sind keiner Organisation zugeordnet.</h2>
                    <p>Um Geräte zu verwalten, müssen Sie entweder eine eigene Organisation erstellen oder einer bestehenden Organisation beitreten.</p>
                    <div style={{ marginTop: '20px' }}>
                        <Button type="primary" style={{ marginRight: '10px' }}>
                            Eigene Organisation erstellen
                        </Button>
                        <Button type="default">
                            Einer Organisation beitreten
                        </Button>
                    </div>
                </div>
            )}
            {isAdmin ? (
                <FloatButton 
                    onClick={showModal} 
                    type='dashed'
                    tooltip={<div>Add new Device</div>} 
                    icon={<PlusOutlined />} 
                    style={{ 
                        width: '60px', 
                        height: '60px', 
                        fontSize: '30px', 
                        background: `linear-gradient(135deg, ${colors.join(", ")})`, 
                    }} 
                />
            ) : null}
        </div>
    );
}
