import React, { useState } from 'react';
import { Modal, Input, Button,Spin,Alert } from 'antd';
import { OrganizationFactory } from '../web3/contracts';

export default function CreateOrganization({ onClose, loadOrganizations }) {
  const [organizationName, setOrganizationName] = useState('');
  const[loading,setLoading]=useState(false)
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlertMessage,setShowAlterMessage]=useState(false);
  const organizationFactory = new OrganizationFactory();

  const createOrganization = async () => {
    await organizationFactory.initialize();
    await organizationFactory.createOrganization(organizationName);
    setAlertMessage(`Organization ${organizationName} was created`);
    setLoading(true);
    organizationFactory.setOrganizationListenerCreate(loadOrganizations)
    await loadOrganizations();
    onClose();
  };

  return (
    <div>
    <div style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
                {loading && <Spin size="large" />}
            </div>
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
    <Modal
      visible={true}
      onOk={createOrganization}
      onCancel={onClose}
    >
        <br></br>
        <br></br>
      <Input
        placeholder="Organization Name"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.target.value)}
      />
       <br></br>
       <br></br>
      <Button type="primary" onClick={createOrganization}>Create Organization</Button>
    </Modal>
    </div>
  );
}
