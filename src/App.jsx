import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MultiFarmMonitoring from "./pages/MultiFarmMonitoring";
import FarmDetails from "./pages/FarmDetails";
import FarmLocationMap from "./pages/FarmLocationMap";
import Alerts from "./pages/Alerts";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Profile from "./pages/Profile";

import SuperadminOverview from "./pages/superadmin/SuperadminOverview";
import UserManagement from "./pages/superadmin/UserManagement";
import ArchivedAccounts from "./pages/superadmin/ArchivedAccounts";
import DeviceRegistry from "./pages/superadmin/DeviceRegistry";
import AuditLogs from "./pages/superadmin/AuditLogs";
import AccountApproval from "./pages/superadmin/AccountApproval";

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

        <Route path="/superadmin/overview" element={<SuperadminOverview />} />
        <Route path="/superadmin/users" element={<UserManagement />} />
        <Route path="/superadmin/users/archived" element={<ArchivedAccounts />} />
        <Route path="/superadmin/devices" element={<DeviceRegistry />} />
        <Route path="/superadmin/logs" element={<AuditLogs />} />
        <Route path="/superadmin/approvals" element={<AccountApproval />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;