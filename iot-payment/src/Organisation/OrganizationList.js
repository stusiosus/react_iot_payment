import { useState, useEffect } from "react";
import {
  Drawer,
  Input,
  Button,
  List,
  Modal,
  Radio,
  Card,
  Flex,
  Progress,
  Space,
} from "antd";
import {
  OrganizationFactory,
  Organization,
  Campaign,
  FundRaising,
} from "../web3/contracts";
import { useNavigate } from "react-router-dom";

export default function OrganizationList({ organizations, loadOrganizations }) {

  const organizationFactory = new OrganizationFactory();
  const organizationContract = new Organization();
  const [organizationName, setOrganizationName] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [revieverAddress, setRecieverAddress] = useState(null);
  const [mintAdmin, setMintAmin] = useState(1);
  const [addOrganisationAddress, setAddOrganisationAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();


  const selectOrganisation = async (org) => {
    setOrganization(org);
    localStorage.setItem("orgid", org.id);
    localStorage.setItem("orgname", org.name);
    localStorage.setItem("orgaddresse", org.NFTAddress);
    localStorage.setItem("orgcreator", org.creator);
    localStorage.setItem("isAdmin", await isAdmin(org));

    window.location.reload();
  };

  const removeOrganization = async () => {
    await organizationFactory.initialize();
    await organizationFactory.removeOrganization(organization.NFTAddress);
    organizationFactory.setOrganizationListenerRemove(loadOrganizations);
  };

  async function isAdmin(org){
    await organizationContract.initialize(org.NFTAddress);
    return await organizationContract.isAdmin();
  }
  const mintOrganizationNFT=async ()=>{

    await organizationContract.initialize(organization.NFTAddress);
    await organizationContract.mintOrganizationToken(revieverAddress,mintAdmin)
  }
  async function showModal(organisation) {

    setOrganization(organisation);
    setOpenModal(true);
  }
  
 
  const handleOk = async () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };
  const onChange = (e) => {
   
    setMintAmin(e.target.value);
  };


  return (
    <div>
      <Modal visible={openModal} onOk={handleOk} onCancel={handleCancel}>
        {organization ? (
          <div>
            Organization Address: {organization.NFTAddress}
            <br></br>
            {organization.NFTsAddress}
            <br></br>
            <br></br>
            <hr></hr>
            <br></br>
          </div>
        ) : (
          <></>
        )}

        <Input
          placeholder="Reciever Address here"
          onChange={(e) => setRecieverAddress(e.target.value)}
        ></Input>
        <br></br>
        <br></br>
        <Radio.Group onChange={onChange} value={mintAdmin}>
          <Radio value={1}>create User Organisation NFT</Radio>
          <Radio value={0}>create Admin Organisation NFT</Radio>
        </Radio.Group>
        <br></br>
        <br></br>
        <Button type="primary" shape="round" onClick={mintOrganizationNFT}>
          {mintAdmin == 0
            ? "Send User NFT for Organisation Reading Access"
            : "Send Amin NFT for Organisation Writing Access"}
        </Button>
        <br></br>
        <br></br>
        <br></br>
        <hr></hr>
        <br></br>
        <Button type="primary" onClick={removeOrganization}>
          Delete Organization from your List
        </Button>
      </Modal>
      <List
        size="small"
        bordered
        dataSource={organizations}
        renderItem={(org) => (
          <List.Item
            actions={[
              <Button
                key={`${org.id}-select`}
                onClick={() => selectOrganisation(org)}
              >
                Select
              </Button>,
              <Button
                key={`${org.id}-edit`}
                onClick={() => showModal(org)}
              >
                edit
              </Button>,
            ]}
          >
            {org.name}
          </List.Item>
        )}
      />
    </div>
  );
}
