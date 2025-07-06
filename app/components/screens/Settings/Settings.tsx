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
    <div className="space-y-6 text-black">
      <div className="flex justify-between bg-purple-400 p-2">
        <button
          className={`cursor-pointer ${
            activeSetting === "profile" ? "text-white" : ""
          }`}
          onClick={() => setActiveSetting("profile")}
          // style={{ border: "1px solid black", margin: "auto 5px" }}
        >
          Profile
        </button>

        <button
          className={`cursor-pointer ${
            activeSetting === "changePassword" ? "text-white" : ""
          }`}
          onClick={() => setActiveSetting("changePassword")}
          // style={{ border: "1px solid black", margin: "auto 5px" }}
        >
          Change Password
        </button>

        {/* -------------------admin only options ------------------- */}
        {(!roleId || (roleId !== 2 && roleId !== 3)) && (
          <>
            <button
              className={`cursor-pointer ${
                activeSetting === "organisationProfile" ? "text-white" : ""
              }`}
              onClick={() => setActiveSetting("organisationProfile")}
              // style={{ border: "1px solid black", margin: "auto 5px" }}
            >
              Orgainsation Profile
            </button>

            <button
              className={`cursor-pointer ${
                activeSetting === "users" ? "text-white" : ""
              }`}
              onClick={() => setActiveSetting("users")}
              // style={{ border: "1px solid black", margin: "auto 5px" }}
            >
              Users
            </button>
            <button
              className={`cursor-pointer ${
                activeSetting === "leadTypes" ? "text-white" : ""
              }`}
              onClick={() => setActiveSetting("leadTypes")}
              // style={{ border: "1px solid black", margin: "auto 5px" }}
            >
              Lead Types
            </button>
            <button
              className={`cursor-pointer ${
                activeSetting === "leadSources" ? "text-white" : ""
              }`}
              onClick={() => setActiveSetting("leadSources")}
              // style={{ border: "1px solid black", margin: "auto 5px" }}
            >
              LeadSources
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeSetting === "profile" && <Profile />}
        {activeSetting === "changePassword" && <UpdatePassword />}
        {/*---------------- admin only tabs---------------- */}
        {(!roleId || (roleId !== 2 && roleId !== 3)) && (
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
