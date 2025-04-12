"use client";
import { useState } from "react";
import { Profile } from "./Profile";
import { UpdatePassword } from "./UpdatePassword";
import { LeadTypes } from "./LeadTypes";
import { OrganisationProfile } from "./OrganisationProfile";
import { Users } from "./Users";
import { LeadSources } from "./LeadSources";
export function Settings() {
  const [activeSetting, setActiveSetting] = useState("profile");

  return (
    <div className="p-6 space-y-6 text-black">
      <button
        onClick={() => setActiveSetting("profile")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Profile
      </button>

      <button
        onClick={() => setActiveSetting("organisationProfile")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Orgainsation Profile
      </button>

      <button
        onClick={() => setActiveSetting("changePassword")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Change Password
      </button>
      <button
        onClick={() => setActiveSetting("users")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Users
      </button>
      <button
        onClick={() => setActiveSetting("leadTypes")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Lead Types
      </button>
      <button
        onClick={() => setActiveSetting("leadSources")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        LeadSources
      </button>
      <div className="flex-1 overflow-auto p-6">
        {activeSetting === "profile" && <Profile />}
        {activeSetting === "organisationProfile" && <OrganisationProfile />}
        {activeSetting === "changePassword" && <UpdatePassword />}
        {activeSetting === "users" && <Users />}
        {activeSetting === "leadTypes" && <LeadTypes />}
        {activeSetting === "leadSources" && <LeadSources />}
      </div>
    </div>
  );
}
