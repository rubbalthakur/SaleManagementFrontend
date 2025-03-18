"use client";
import { useState } from "react";
export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  return (
    <div className="p-6 space-y-6 text-black">
      <button
        onClick={() => setActiveTab("profile")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Profile
      </button>
      <button
        onClick={() => setActiveTab("changePassword")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Change Password
      </button>
      <button
        onClick={() => setActiveTab("users")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Users
      </button>
      <button
        onClick={() => setActiveTab("leadTypes")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Lead Types
      </button>
      <button
        onClick={() => setActiveTab("leadSources")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        LeadSources
      </button>
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "profile" && <div>profile abcd</div>}
        {activeTab === "changePassword" && <div>changePassword abc</div>}
        {activeTab === "users" && <div>Users abc</div>}
        {activeTab === "leadTypes" && <div>Lead Types abc</div>}
        {activeTab === "leadSources" && <div>Lead Sources abc</div>}
      </div>
    </div>
  );
}
