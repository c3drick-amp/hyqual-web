import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MultiFarmMonitoring from "./pages/MultiFarmMonitoring";
import FarmDetails from "./pages/FarmDetails";
import FarmLocationMap from "./pages/FarmLocationMap";
import Alerts from "./pages/Alerts";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Profile from "./pages/Profile";

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
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<ReportsAnalytics />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;