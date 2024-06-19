import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Alert } from 'antd';
import { DeviceFactory } from './web3/contracts';
import { DynamicCardsDevice } from "./DynamicCardsDevice";

export function Devices() {
    const [devices, setDevices] = useState([]);
    const [deviceName, setDeviceName] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [showAlertMessage,setShowAlterMessage]=useState(false);
    const [deviceInstance, setDeviceInstance] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [showInfoScreen, setShowInfoScreen] = useState(false);

    const deviceFactory = new DeviceFactory();

    const getDevices = async () => {
        try {
            const fetchedDevices = await deviceFactory.getDevices();
            setDevices(fetchedDevices);
        } catch (e) {
            if (e.message && e.message.includes("no data present")) {
                setShowInfoScreen(true);
            }
        }
    };

    const eventcallback = async () => {
        getDevices();
        setShowAlterMessage(true);
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
            setAlertMessage(`${deviceName} was created`);
            deviceInstance.setDeviceListenerCreate(eventcallback);
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };

    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return (
        <div>
            {!showInfoScreen ? (
                <> 
                    <div>
                        {showAlertMessage ? (
                            <>
                                <Alert message={alertMessage} type="success" closable showIcon />
                                <br />
                            </>
                        ) : null}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', padding: '80px' }}>
                            {isAdmin ? (
                                <Button type='primary' onClick={showModal} block>
                                    Create New Device
                                </Button>
                            ) : (
                                <></>
                            )}
                        </div>
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
                            <DynamicCardsDevice items={devices}  eventcallback={eventcallback} setAlertMessage={setAlertMessage} setShowAlterMessage={setShowAlterMessage} />
                        </div>
                    </div>
                </>
            ) : 
            
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
            
            }
        </div>
    );
}
