"use client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  setLoggedInUserId,
  setRoleId,
  clearAuth,
} from "../store/features/auth/authSlice";

import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Client } from "../components/screens/Clients/Client";

import { Sidebar } from "../components/screens/SideBar/SideBar";
import { Dashboard } from "../components/screens/Dashboard/Dashboard";
import { Leads } from "../components/screens/Leads/Leads";
import { Analytics } from "../components/screens/Analytics/Analytics";
import { Settings } from "../components/screens/Settings/Settings";

interface CustomJwtPayload extends JwtPayload {
  id?: number;
}
const SalesFunnelDashboard: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState("dashboard");

  const verifyToken = (token: string) => {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return false;
      }
      if (decoded?.id) {
        dispatch(setLoggedInUserId(decoded.id));
      }
      return true;
    } catch (error) {
      console.log("error in verifying token", error);
      return false;
    }
  };

  const getUserOrganisation = async () => {
    try {
      const response = await api.post(API_CONFIG.GET_USER_ORGANISATION);
      if (response?.data?.roleId) {
        dispatch(setRoleId(response.data.roleId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !verifyToken(token)) {
      localStorage.removeItem("token");
      dispatch(clearAuth());
      router.push("/");
    }
  });
  useEffect(() => {
    getUserOrganisation();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "leads" && <Leads />}
        {activeTab === "clients" && <Client />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default SalesFunnelDashboard;
