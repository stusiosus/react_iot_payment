import { useEffect, useState } from 'react';
import { DeviceFactory } from './web3/contracts';
import React from 'react';
import { Button, Modal,Input ,Alert} from 'antd';
import {DynamicCardsDevice} from "./DynamicCards";


export function Devices() {
    const [devices, setDevices] = useState([]);
    const [deviceName, setDeviceName] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [deviceInstance, setDeviceInstance] = useState(null);
    
    const [initialized, setInitialized] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [deviceBalance,setDeviceBalance]=useState(0);

    useEffect(() => {
        const initializeDeviceFactory = async () => {
            const device = new DeviceFactory();
            await device.initialize();
            setDeviceInstance(device);
            setInitialized(true);
            try {
                const fetchedDevices = await device.getDevices();
                setDevices(fetchedDevices);
               
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };
        initializeDeviceFactory();
    }, [alertMessage,localStorage.orgaddresse]);

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
            setAlertMessage('Device added successfully');
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };

    return (
        <div>
            {alertMessage ? <><Alert message={deviceName+ " was created"} type="success" closable showIcon /> <br></br> </>: null}
            
            <div style={{display:"flex",justifyContent:"center",alignItems: 'center',padding: '80px',}}>
            <Button onClick={showModal} block>
                Create New Device
            </Button>
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
                    <DynamicCardsDevice items={devices} />
                </div>
           
        
        </div>
    );
}
