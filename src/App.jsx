import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MultiFarmMonitoring from "./pages/MultiFarmMonitoring";
import FarmDetails from "./pages/FarmDetails";
import FarmLocationMap from "./pages/FarmLocationMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/multi-farm" element={<MultiFarmMonitoring />} />
        <Route path="/multi-farm/:farmId" element={<FarmDetails />} />
        <Route path="/farm-map" element={<FarmLocationMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;