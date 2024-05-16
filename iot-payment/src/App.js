import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navigation/Navbar"
import {Devices} from "./Devices";
import {Actions} from "./Actions";


export default function App(){

      return(
        <div>
        <Navbar />
        <Routes>
        <Route path="/actions"  element={<Actions />} />
        <Route path="/devices" element={<Devices />} />
        </Routes>
        </div>
     
      )
      


}