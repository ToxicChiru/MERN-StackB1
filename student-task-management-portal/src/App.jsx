import "./App.css";

import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Dashboard from "./components/Dashboard";

import {Routes, Route} from "react-router-dom"
import Tasks from "./components/Tasks";

function App(){
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </div>
  );
}

export default App;