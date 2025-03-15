'use client';
import { useState } from "react";
import { Sidebar } from "../components/screens/SideBar/SideBar";
import { Dashboard } from "../components/screens/Dashboard/Dashboard";
import { Leads } from "../components/screens/Leads/Leads";
import { Analytics } from "../components/screens/Analytics/Analytics";
import { Settings } from "../components/screens/Settings/Settings";
const SalesFunnelDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActiveTab={setActiveTab}/>
      
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "leads" && <Leads />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default SalesFunnelDashboard;
