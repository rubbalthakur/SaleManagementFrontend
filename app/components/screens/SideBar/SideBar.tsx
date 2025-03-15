'use client'

import { Button } from "../../ui/button";
import { Home, BarChart as ChartIcon, Users, Settings,LogOutIcon } from "lucide-react";
interface SidebarProps {
    setActiveTab: (tab: string) => void;
  }
export function Sidebar  ({ setActiveTab }:SidebarProps) {
    return (
      <div className="w-64 h-screen bg-gray-900 text-white p-5 space-y-6">
        <h2 className="text-xl font-bold ">Sales Funnel</h2>
        <nav className="space-y-4">
          <Button variant="ghost" className="w-full" onClick={() => setActiveTab("dashboard")}>
            <Home className="w-5 h-5 mr-2" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setActiveTab("leads")}>
            <Users className="w-5 h-5 mr-2" /> Leads
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setActiveTab("analytics")}>
            <ChartIcon className="w-5 h-5 mr-2" /> Proposals
          </Button>
          
          <Button variant="ghost" className="w-full" onClick={() => setActiveTab("settings")}>
            <Settings className="w-5 h-5 mr-2" /> Settings
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setActiveTab("settings")}>
            <LogOutIcon className="w-5 h-5 mr-2" /> Logout
          </Button>
        </nav>
      </div>
    );
  };
  