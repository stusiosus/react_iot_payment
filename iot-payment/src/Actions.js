import { useEffect, useState } from 'react';
import { ActionFactory,Device } from './web3/contracts';
import React from 'react';
import { Button, Modal,Input ,Alert} from 'antd';
import {DynamicCardsAction, DynamicCardsDevice} from "./DynamicCards";
import { useLocation } from 'react-router-dom';


export function Actions() {
    const device =useLocation().state
    
   
    const [actions, setActions] = useState([]);

    const [actionName, setActionName] = useState('');
    const [actionPrice, setActionPrice] = useState('');
    const [actionunit, setActionUnit] = useState('');

    const [alertMessage, setAlertMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);


    const actionFactory = new ActionFactory();
    const deviceContract=new Device();

    useEffect(() => {
        const initializeDeviceFactory = async () => {

            await actionFactory.initialize();

            await deviceContract.initialize(device.deviceAddress);


            try {
                setActions(await actionFactory.getActions(device.deviceAddress));
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };
        initializeDeviceFactory();
    },[]);



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
            await deviceContract.addAction(actionName,actionunit,actionPrice);
            setAlertMessage('Device added successfully');
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };

    const isAdmin = localStorage.getItem('isAdmin') === 'true'; 


    return (
        <div>
            {alertMessage ? <><Alert message={actionName+ " was created"} type="success"  closable showIcon /> <br></br> </>: null}
            {isAdmin?<Button type="primary" onClick={showModal}>
                Create New Action
            </Button>:
            <></>}
            
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
                    <DynamicCardsAction items={actions} />
                </div>
          
        </div>
    );
}
