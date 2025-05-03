"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

import { Profile } from "./Profile";
import { UpdatePassword } from "./UpdatePassword";
import { LeadTypes } from "./LeadTypes";
import { OrganisationProfile } from "./OrganisationProfile";
import { Users } from "./Users";
import { LeadSources } from "./LeadSources";

export function Settings() {
  const roleId = useSelector((state: RootState) => state.auth.roleId);

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
        onClick={() => setActiveSetting("changePassword")}
        style={{ border: "1px solid black", margin: "auto 5px" }}
      >
        Change Password
      </button>

      {/* -------------------admin only options ------------------- */}
      {roleId === 1 && (
        <>
          <button
            onClick={() => setActiveSetting("organisationProfile")}
            style={{ border: "1px solid black", margin: "auto 5px" }}
          >
            Orgainsation Profile
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
        </>
      )}

      <div className="flex-1 overflow-auto p-6">
        {activeSetting === "profile" && <Profile />}
        {activeSetting === "changePassword" && <UpdatePassword />}
        {/*---------------- admin only tabs---------------- */}
        {roleId === 1 && (
          <>
            {activeSetting === "organisationProfile" && <OrganisationProfile />}
            {activeSetting === "users" && <Users />}
            {activeSetting === "leadTypes" && <LeadTypes />}
            {activeSetting === "leadSources" && <LeadSources />}
          </>
        )}
      </div>
    </div>
  );
}
