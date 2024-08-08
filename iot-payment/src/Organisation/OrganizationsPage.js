import React, { useState, useEffect } from 'react';
import { Button, Input, List, Layout, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CreateOrganization from './CreateOrganization';
import AddExistingOrganization from './AddExistingOrganization';
import OrganizationList from './OrganizationList';
import { OrganizationFactory } from '../web3/contracts';

const { Content } = Layout;
const { Title } = Typography;

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const navigate = useNavigate();
  
  const organizationFactory = new OrganizationFactory();

  const loadOrganizations = async () => {
    await organizationFactory.initialize();
    setOrganizations(await organizationFactory.getOrganizations());
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  return (
    
      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>Manage Organizations</Title>
          <Row justify="center" style={{ marginBottom: '24px' }}>
            <Col>
              <Button type="primary" onClick={() => setOpenCreate(true)}>Create New Organization</Button>
            </Col>
            <Col style={{ marginLeft: '16px' }}>
              <Button type="primary" onClick={() => setOpenAdd(true)}>Add Existing Organization</Button>
            </Col>
          </Row>
          <OrganizationList 
            organizations={organizations} 
            loadOrganizations={loadOrganizations}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          />
          {openCreate && (
            <CreateOrganization 
              onClose={() => setOpenCreate(false)} 
              loadOrganizations={loadOrganizations} 
            />
          )}
          {openAdd && (
            <AddExistingOrganization 
              onClose={() => setOpenAdd(false)} 
              loadOrganizations={loadOrganizations} 
            />
          )}
         
        </div>
      </Content>

  );
}
