import React from 'react';
import './App.css';
import NavBar from './NavBar.js'

function App() {
  return (
      <div>
        <h1 style={{fontFamily: "shadows-into-light"}}>ISO WebSim - ISO8583 Web
          Simulator</h1>
        <div className="App">
          <NavBar/>
        </div>
      </div>
  );
}

export default App;
