import { React, useState } from 'react'
import './App.css'
import EdQueue from './EdQueue'
import PatientList from './PatientList'
import QueueStats from './QueueStats'
import Interface from './Interface'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <Router>
      <>
        {/* <Nav userId={id}></Nav> */}
        <Routes>
          <Route path='/' element={"Nothing to be shown here, you're not a user"} />
          <Route path='/user/:id' element={<Interface />} />
        </Routes>
      </>
    </Router>
  )
}

export default App
