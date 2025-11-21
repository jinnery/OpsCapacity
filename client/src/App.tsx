import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CTODashboard from './components/CTODashboard';
import CEODashboard from './components/CEODashboard';
import OpsDirectorDashboard from './components/OpsDirectorDashboard';
import OpsEngineerDashboard from './components/OpsEngineerDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>容量扩容诊断报表系统</h1>
          <div className="nav-links">
            <Link to="/cto">CTO视角</Link>
            <Link to="/ceo">CEO视角</Link>
            <Link to="/ops-director">运维总监</Link>
            <Link to="/ops-engineer">运维工程师</Link>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CTODashboard />} />
            <Route path="/cto" element={<CTODashboard />} />
            <Route path="/ceo" element={<CEODashboard />} />
            <Route path="/ops-director" element={<OpsDirectorDashboard />} />
            <Route path="/ops-engineer" element={<OpsEngineerDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;