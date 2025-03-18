"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import {
  Home,
  BarChart as ChartIcon,
  Users,
  Settings,
  LogOutIcon,
} from "lucide-react";
interface SidebarProps {
  setActiveTab: (tab: string) => void;
}
export function Sidebar({ setActiveTab }: SidebarProps) {
  const router = useRouter();
  const handleLogout = () => {
    console.log("Logging out", localStorage.getItem("token"));
    localStorage.removeItem("token");
    console.log("Logged out", localStorage.getItem("token"));
    router.push("/");
  };

  return (
    <div className="sidebar-container">
      <h2 className="text-xl font-bold ">Sales Funnel</h2>
      <nav className="space-y-4">
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setActiveTab("dashboard")}
        >
          <Home className="w-5 h-5 mr-2" /> Dashboard
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setActiveTab("leads")}
        >
          <Users className="w-5 h-5 mr-2" /> Leads
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setActiveTab("analytics")}
        >
          <ChartIcon className="w-5 h-5 mr-2" /> Proposals
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="w-5 h-5 mr-2" /> Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => handleLogout()}
        >
          <LogOutIcon className="w-5 h-5 mr-2" /> Logout
        </Button>
      </nav>
    </div>
  );
}
