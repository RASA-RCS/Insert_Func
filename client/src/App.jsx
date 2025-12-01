import { useState } from 'react'
import Home from './components/Home'
import { Routes, Route } from "react-router-dom";
import Registation from './components/Register';


function App() {


  return (
    <>

      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Registation/>}/>
      </Routes>


    </>
  )
}

export default App
