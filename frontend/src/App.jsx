import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";


function App() {
  console.log("App component rendered"); 
  return (
      <NoteState>
        <Router>
          <Navbar />
          <Alert message="This is amazing react app"/>
          <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
          </div>
        </Router>
      </NoteState>
    
  );
}

export default App;