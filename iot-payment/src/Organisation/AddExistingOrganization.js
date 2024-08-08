import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { OrganizationFactory } from '../web3/contracts';

export default function AddExistingOrganization({ onClose, loadOrganizations }) {
  const [organizationAddress, setOrganizationAddress] = useState('');
  const organizationFactory = new OrganizationFactory();

  const addOrganization = async () => {
    await organizationFactory.initialize();
    await organizationFactory.addOrganization(organizationAddress);
    await loadOrganizations();
    onClose();
  };

  return (
    <Modal
      visible={true}
      onOk={addOrganization}
      onCancel={onClose}
    >
         <br></br>
         <br></br>
      <Input
        placeholder="Organization Address"
        value={organizationAddress}
        onChange={(e) => setOrganizationAddress(e.target.value)}
      />
       <br></br>
       <br></br>
      <Button type="primary" onClick={addOrganization}>Add Organization</Button>
    </Modal>
  );
}
