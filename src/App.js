import React from 'react';
import './App.css';
import NavBar from './NavBar.js'

function App() {
  return (
      <div style={{backgroundColor:'#fbfff0'}}>
        <h1 style={{fontFamily: "shadows-into-light"}}>ISO WebSim - ISO8583 Web
          Simulator</h1>
        <a style={{fontFamily: 'ptserif-regular', fontSize: '12px'}}
           href={"/iso/home"} target={"_blank"}>[Non React App]</a>
        <a style={{fontFamily: 'ptserif-regular', fontSize: '12px'}}
          href={"/iso/v0/server"} target={"_blank"}>[Manage Servers]</a>

        <div className="App">
          <NavBar/>
        </div>
      </div>
  );
}

export default App;
