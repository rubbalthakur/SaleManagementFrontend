"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/screens/SideBar/SideBar";
import { Dashboard } from "../components/screens/Dashboard/Dashboard";
import { Leads } from "../components/screens/Leads/Leads";
import { Analytics } from "../components/screens/Analytics/Analytics";
import { Settings } from "../components/screens/Settings/Settings";
import { jwtDecode } from "jwt-decode";
const SalesFunnelDashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  const verifyToken = (token: any) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !verifyToken(token)) {
      localStorage.removeItem("token");
      router.push("/");
    }
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActiveTab={setActiveTab} />

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
