"use client";
import { AdminLeads } from "./AdminLeads";
import { UserLeads } from "./UserLeads";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

export function Leads() {
  const loggedInUserId = useSelector(
    (state: RootState) => state.auth.loggedInUserId
  );
  const roleId = useSelector((state: RootState) => state.auth.roleId);

  if (!loggedInUserId || !roleId) {
    return <div>Unauthorized</div>;
  }

  return <>{roleId === 1 ? <AdminLeads /> : <UserLeads />}</>;
}
