"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { Lead } from "@/types/Lead";

interface Props {
  onEdit: (lead: Lead) => void;
  onAdd: () => void;
  onView: (lead: Lead) => void;
}

export function DisplayLeads({ onEdit, onAdd, onView }: Props) {
  const loading = useSelector((state: RootState) => state.leads.loading);
  const error = useSelector((state: RootState) => state.leads.error);

  const roleId = useSelector((state: RootState) => state.auth.roleId);
  const allLeads = useSelector((state: RootState) => state.leads.leads);
  const users = useSelector((state: RootState) => state.users.users);
  const leadSources = useSelector(
    (state: RootState) => state.leadSources.leadSources
  );
  const leadTypes = useSelector(
    (state: RootState) => state.leadTypes.leadTypes
  );

  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [filterLeadType, setFilterLeadType] = useState<string>("");
  const [filterLeadSource, setFilterLeadSource] = useState<string>("");
  const [filterUser, setFilterUser] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const clearFilter = () => {
    setFilterLeadSource("");
    setFilterLeadType("");
    setFilterUser("");
    setFilterStatus("");
  };

  const handleFilterChange = (
    filterType: "leadType" | "leadSource" | "user" | "status",
    value: string
  ) => {
    switch (filterType) {
      case "leadType":
        setFilterLeadType(value);
        break;
      case "leadSource":
        setFilterLeadSource(value);
        break;
      case "user":
        setFilterUser(value);
        break;
      case "status":
        setFilterStatus(value);
      default:
        break;
    }
  };

  useEffect(() => {
    let filtered = [...allLeads];

    if (filterLeadType) {
      filtered = filtered.filter(
        (lead) => lead.leadTypeId.toString() === filterLeadType
      );
    }
    if (filterLeadSource) {
      filtered = filtered.filter(
        (lead) => lead.leadSourceId.toString() === filterLeadSource
      );
    }
    if (filterUser) {
      filtered = filtered.filter(
        (lead) => lead.userId.toString() === filterUser
      );
    }
    if (filterStatus) {
      filtered = filtered.filter((lead) => lead.status === filterStatus);
    }

    setFilteredLeads(filtered);
  }, [filterLeadType, filterLeadSource, filterUser, filterStatus, allLeads]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error in loading leads
      </div>
    );
  }

  return (
    <>
      {/*---------------------------------------display lead-------------------------------------------------*/}

      <div className="border rounded-lg shadow-md p-8 w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">
          {" "}
          Leads{" "}
          <div className="flex items-center space-x-4">
            {/* -------------filter by lead type-------------------- */}
            <select
              value={filterLeadType}
              onChange={(e) => handleFilterChange("leadType", e.target.value)}
              className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Filter by Lead Type</option>
              {leadTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.leadTypeName}
                </option>
              ))}
            </select>
            {/* -------------filter by lead source------------------- */}
            <select
              value={filterLeadSource}
              onChange={(e) => handleFilterChange("leadSource", e.target.value)}
              className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Filter by Lead Source</option>
              {leadSources.map((ls) => (
                <option key={ls.id} value={ls.id}>
                  {ls.leadSourceName}
                </option>
              ))}
            </select>
            {/* -------------filter by user-------------------- */}
            {roleId === 1 ? (
              <select
                value={filterUser}
                onChange={(e) => handleFilterChange("user", e.target.value)}
                className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Filter by User</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.User.firstName} {user.User.lastName} (
                    {user.User.emailId})
                  </option>
                ))}
              </select>
            ) : (
              ""
            )}

            {/* -------------filter by lead status-------------------- */}
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Filter By Status</option>
              <option value="New">New</option>
              <option value="Discussion">Discussion</option>
              <option value="Hold">Hold</option>
              <option value="Hot">Hot</option>
              <option value="Closed">Closed</option>
            </select>
            <button
              onClick={() => clearFilter()}
              className="mt-2 hover:bg-blue-400 bg-blue-100 text-black font-semibold py-2 px-4 rounded text-base"
            >
              clear filter
            </button>
            <button
              onClick={() => {
                onAdd();
              }}
              className="mt-2 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              Add Lead
            </button>
          </div>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">LeadType</th>
                <th className="py-2 px-4 border-b">LeadSource</th>
                <th className="py-2 px-4 border-b">Assigned To</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{lead.id}</td>
                  <td className="py-2 px-4 border-b">
                    {lead.LeadType.leadTypeName}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {lead.LeadSource.leadSourceName}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {lead.User.firstName} {lead.User.lastName}
                  </td>
                  <td className="py-2 px-4 border-b">{lead.User.emailId}</td>

                  <td className="py-2 px-4 border-b">{lead.status}</td>
                  <td className="py-2 px-4 border-b">{lead.description}</td>
                  <td className="py-2 px-4 border-b">
                    <span className="flex space-x-2">
                      <button
                        onClick={() => {
                          onView(lead);
                        }}
                        className="mt-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          onEdit(lead);
                        }}
                        className="mt-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                      >
                        Update
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
