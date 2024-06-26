import { useState, useEffect } from "react";
import { Drawer, Input, Button, List, Modal,Radio ,Card,Flex, Progress, Space } from "antd";
import { OrganizationFactory,Organization,Campaign, FundRaising } from "../web3/contracts";
import CampaignList from "../CampaignList";

export default function OrganizationsDrawer({
  placement,
  onClose,
  open,
  setOpen,
}) {
  const [organizations, setOrganizations] = useState([]);
  const [organizationName, setOrganizationName] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [revieverAddress,setRecieverAddress]=useState(null);
  const [mintAdmin,setMintAmin]=useState(1);
  const [addOrganisationAddress,setAddOrganisationAddress]=useState(null);
  const [campaigns,setCampaigns]=useState([]);


  const organizationFactory = new OrganizationFactory();
  const organizationContract = new Organization();
  const campaign= new Campaign();
  const fundRaising=new FundRaising();
   

  async function loadOrganizations() {
    await organizationFactory.initialize();
    setOrganizations(await organizationFactory.getOrganizations());
  }

  const createOrganization = async () => {
    await organizationFactory.initialize();
    await organizationFactory.createOrganization(organizationName);
    organizationFactory.setOrganizationListenerCreate(loadOrganizations);
  };
  const addOrganization = async () => {
    await organizationFactory.initialize();
    await organizationFactory.addOrganization(addOrganisationAddress);
    organizationFactory.setOrganizationListenerAdd(loadOrganizations);
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
  const selectOrganisation = async (org) => {
    setOrganization(org);
    localStorage.setItem("orgid", org.id);
    localStorage.setItem("orgname", org.name);
    localStorage.setItem("orgaddresse", org.NFTAddress);
    localStorage.setItem("orgcreator", org.creator);
    localStorage.setItem("isAdmin", await isAdmin(org));

    setOpen(false);
    window.location.reload();
  };

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

  const mintOrganizationNFT=async ()=>{

    await organizationContract.initialize(organization.NFTAddress);
    await organizationContract.mintOrganizationToken(revieverAddress,mintAdmin)
  }
  const listCampaigns= async ()=>{

    await fundRaising.initialize();
    console.log(await fundRaising.getCampaignsByOrganization(localStorage.orgaddresse));
    setCampaigns(await fundRaising.getCampaignsByOrganization(localStorage.orgaddresse));
  }



  useEffect(() => {
    loadOrganizations();
    if (localStorage.orgaddresse)
    listCampaigns();
  }, []);

  return (
    <>
      <Modal
        visible={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {organization?
        <div>
        Organization Address: {organization.NFTAddress}
        <br></br>
        {organization.NFTsAddress}
        <br></br>
        <br></br>
        <hr></hr>
        <br></br>
        </div>
        :<></>}
        
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
          {mintAdmin==0?"Send User NFT for Organisation Reading Access":"Send Amin NFT for Organisation Writing Access"}
        </Button>
        <br></br>
        <br></br>
        <br></br>
        <hr></hr>
        <br></br>
        <Button type="primary" onClick={removeOrganization}>Delete Organization from your List</Button>
      </Modal>
      <Drawer
        title="Organizations"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <Input
          placeholder="Organisation Name"
          onChange={(e) => setOrganizationName(e.target.value)}
        ></Input>
        <br></br>
        <br></br>
    
  
        <Button type="primary" shape="round" onClick={createOrganization}>
          create new Organisation
        </Button>
        <br></br>
        <br></br>
        <hr></hr>

        <br></br>
        <div>Your Organizations: </div>
        <br></br>
        <List
          size="small"
          bordered
          dataSource={organizations}
          renderItem={(organisation) => (
            <List.Item
              actions={[
                <a
                  key={`${organisation.id}-select`}
                  onClick={() => selectOrganisation(organisation)}
                >
                  select
                </a>,
                <a
                  key={`${organisation.id}-edit`}
                  onClick={() => showModal(organisation)}
                >
                  edit
                </a>,
              ]}
            >
              {organisation.name}
            </List.Item>
          )}
        />
        <br></br>
        <hr></hr>
        <br></br>
        <br></br>
        <Input
          placeholder="Organisation address"
          onChange={(e) => setAddOrganisationAddress(e.target.value)}
        ></Input>
        <br></br>
        <br></br>
        <Button type="primary" shape="round" onClick={addOrganization}>
          add an existing Organization to your List
        </Button>
          <br></br>
          <br></br>
          <hr></hr>
          <br></br>
          <br></br>
          <CampaignList/>
      </Drawer>
    </>
  );
}
