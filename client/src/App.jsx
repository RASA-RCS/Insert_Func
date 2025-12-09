import { useState } from 'react'
import Home from './components/Home'
import { Routes, Route } from "react-router-dom";
import Registation from './components/Register';
import MultiForm from './components/MultiForm';
import MultiStep from './components/MultiStep';


function App() {


  return (
    <>

      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Registation/>}/>
        <Route path='/multifrom' element={<MultiForm/>}/>
        <Route path='/multistep' element={<MultiStep/>}/>
      </Routes>


    </>
  )
}

export default App
