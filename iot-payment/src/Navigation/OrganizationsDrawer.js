import { useState, useEffect } from "react";
import { Drawer, Input, Button, List, Modal,Radio ,Card,Flex, Progress, Space } from "antd";
import { OrganizationFactory,Organization,Campaign, FundRaising } from "../web3/contracts";
import { useNavigate } from 'react-router-dom';

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
  const navigate =useNavigate();


  const organizationFactory = new OrganizationFactory();
  const organizationContract = new Organization();
  const campaign= new Campaign();
  const fundRaising=new FundRaising();
   

  async function loadOrganizations() {
    await organizationFactory.initialize();
    setOrganizations(await organizationFactory.getOrganizations());
  }

 
  function handleclick(path){
    navigate(path)
    setOpen(false)
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

      <Drawer
        title="Menu"
        placement={placement}
        closable={true}
        onClose={onClose}
        open={open}
        key={placement}
      >
    
        <Button type="primary" shape="round" onClick={()=>{handleclick("/")}}>
          Home
        </Button>
        <br></br>
  
        <br></br>
        <Button type="primary" shape="round" onClick={()=>{handleclick("/organizations/")}}>
          Organisations
        </Button>
        <br></br>
        <br></br>
        <Button type="primary" shape="round" onClick={()=>{handleclick("/devices/")}}>
          Devices
        </Button>
        <br></br>
        <br></br>
        <Button type="primary" shape="round" onClick={()=>{handleclick("/campaigns/")}}>
          campaigns
        </Button>
    
      </Drawer>


    </>
  );
}
