"use client";
import { AdminLeads } from "./AdminLeads";
import { UserLeads } from "./UserLeads";

interface Props {
  loggedInUserId: number | null;
  roleId: number | null;
}

export function Leads({ loggedInUserId, roleId }: Props) {
  if (!loggedInUserId || !roleId) {
    return <div>Unauthorized</div>;
  }

  return (
    <>
      {roleId === 1 ? (
        <AdminLeads loggedInUserId={loggedInUserId} />
      ) : (
        <UserLeads loggedInUserId={loggedInUserId} />
      )}
    </>
  );
}
