import { useState, useEffect } from "react";
import { Drawer, Input, Button, List, Modal,Radio ,RadioChangeEvent} from "antd";
import { OrganizationFactory,Organization } from "../web3/contracts";

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

  const organizationFactory = new OrganizationFactory();
  const organizationContract = new Organization();


  async function loadOrganizations() {
    await organizationFactory.initialize();
    setOrganizations(await organizationFactory.getOrganizations());
  }

  const createOrganization = async () => {
    await organizationFactory.initialize();
    await organizationFactory.createOrganization(organizationName);
  };
  const addOrganization = async () => {
    await organizationFactory.initialize();
    await organizationFactory.addOrganization(addOrganisationAddress);
  };
  const selectOrganisation = (org) => {
    localStorage.setItem("orgid", org.id);
    localStorage.setItem("orgname", org.name);
    localStorage.setItem("orgaddresse", org.NFTAddress);
    localStorage.setItem("orgcreator", org.creator);
    setOpen(false);
    window.location.reload();
  };

  function showModal(organisation) {
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


  useEffect(() => {
    loadOrganizations();
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
        {organization.NFTAddress}
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
                  key={`${organisation.id}-edit`}
                  onClick={() => selectOrganisation(organisation)}
                >
                  select
                </a>,
                <a
                  key={`${organisation.id}-more`}
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
      </Drawer>
    </>
  );
}
