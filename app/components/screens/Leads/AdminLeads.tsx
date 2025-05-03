"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchLeadsForAdmin } from "@/app/store/features/leads/leadSlice";
import { fetchUsersByOrganisation } from "@/app/store/features/users/userSlice";
import { Lead } from "@/types/Lead";

import { toast, ToastContainer } from "react-toastify";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface LeadMessage {
  id: number;
  userId: number;
  leadId: number;
  message: string;
  createdAt: string;
  User: {
    emailId: string;
    firstName: string;
    lastName: string;
  };
}

interface LeadSource {
  id: number;
  leadSourceName: string;
}

interface LeadType {
  id: number;
  leadTypeName: string;
}

export function AdminLeads() {
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUserId = useSelector(
    (state: RootState) => state.auth.loggedInUserId
  );
  const loading = useSelector((state: RootState) => state.leads.loading);
  const error = useSelector((state: RootState) => state.leads.error);

  const [activeLeadTab, setActiveLeadTab] = useState<
    "displayLead" | "addLead" | "updateLead" | "viewLead"
  >("displayLead");

  const allLeads = useSelector((state: RootState) => state.leads.leads);
  const users = useSelector((state: RootState) => state.users.users);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [leadTypes, setLeadTypes] = useState<LeadType[]>([]);

  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [filterLeadType, setFilterLeadType] = useState<string>("");
  const [filterLeadSource, setFilterLeadSource] = useState<string>("");
  const [filterUser, setFilterUser] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [employeeId, setEmployeeId] = useState<string>("");
  const [leadTypeId, setLeadTypeId] = useState<string>("");
  const [leadSourceId, setLeadSourceId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");

  const [leadMessages, setLeadMessages] = useState<LeadMessage[] | []>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [descriptionError, setDescriptionError] = useState<string>("");
  const [employeeIdError, setEmployeeIdError] = useState<string>("");
  const [leadSourceIdError, setLeadSourceIdError] = useState<string>("");
  const [leadTypeIdError, setLeadTypeIdError] = useState<string>("");
  const [statusError, setStatusError] = useState<string>("");
  const [newMessageError, setNewMessageError] = useState<string>("");

  //-----------------------validations-----------------------------------
  const isValid = () => {
    if (!employeeId) {
      setEmployeeIdError("please select Employee");
      return false;
    }
    if (!leadTypeId) {
      setLeadTypeIdError("please select Lead Type");
      return false;
    }
    if (!leadSourceId) {
      setLeadSourceIdError("please select Lead Source");
      return false;
    }
    if (!status) {
      setStatusError("please select Status");
      return false;
    }
    if (description.trim() === "") {
      setDescriptionError("Lead Description is required");
      return false;
    }
    return true;
  };

  //--------------------------reset variables--------------------------
  const resetVariables = () => {
    setDescription("");
    setSelectedLeadId("");
    setEmployeeId("");
    setLeadTypeId("");
    setLeadSourceId("");
    setStatus("");
  };

  //-----------------------------reset error---------------------------------
  const resetError = () => {
    setDescriptionError("");
    setEmployeeIdError("");
    setLeadSourceIdError("");
    setLeadTypeIdError("");
    setStatusError("");
    setNewMessageError("");
  };

  //---------------------------------add new lead-----------------------------------
  const addLead = async (
    employeeId: string,
    leadTypeId: string,
    leadSourceId: string,
    status: string,
    description: string
  ) => {
    try {
      if (!isValid()) return;

      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_LEAD, {
        employeeId: parseInt(employeeId),
        leadTypeId: parseInt(leadTypeId),
        leadSourceId: parseInt(leadSourceId),
        status,
        description,
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success("added lead");
      } else {
        toast.error("lead not added");
      }

      setTimeout(() => {
        resetVariables();
        resetError();
        setProcessing(false);
        setActiveLeadTab("displayLead");
        dispatch(fetchLeadsForAdmin());
      }, 600);
    } catch (error) {
      console.log("error in adding lead", error);
      toast.error("error in adding lead");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //---------------------------------------------update lead ---------------------------------
  const updateLead = async (
    selectedLeadId: string,
    employeeId: string,
    leadTypeId: string,
    leadSourceId: string,
    status: string,
    description: string
  ) => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.UPDATE_LEAD, {
        id: parseInt(selectedLeadId),
        employeeId: parseInt(employeeId),
        leadTypeId: parseInt(leadTypeId),
        leadSourceId: parseInt(leadSourceId),
        status,
        description,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("updated lead");
      } else {
        toast.error("lead not updated");
      }

      setTimeout(() => {
        resetVariables();
        resetError();
        setProcessing(false);
        setActiveLeadTab("displayLead");
        dispatch(fetchLeadsForAdmin());
      }, 600);
    } catch (error) {
      console.log("error in updating lead", error);
      toast.error("lead not updated");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //----------------------------fetch Lead Messages----------------------------------
  const fetchLeadMessages = async (leadId: string) => {
    try {
      setLoadingMessages(true);
      const response = await api.post(API_CONFIG.GET_LEAD_MESSAGES, {
        leadId: parseInt(leadId),
      });
      if (response.data && response.data.length > 0) {
        setLeadMessages(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  //------------------------------Add Lead Message-----------------------------------
  const handleAddMessage = async (selectedLeadId: string) => {
    if (!selectedLeadId) {
      return;
    }
    if (newMessage.trim() === "") {
      setNewMessageError("Message cannot be empty");
      return;
    }
    try {
      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_LEAD_MESSAGE, {
        leadId: parseInt(selectedLeadId),
        message: newMessage.trim(),
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success("Message added");
        setNewMessage("");
        setNewMessageError("");
        fetchLeadMessages(selectedLeadId);
      } else {
        toast.error("Failed to add message");
      }
    } catch (error) {
      console.error("Error adding lead message:", error);
      toast.error("Failed to add message");
    } finally {
      setProcessing(false);
    }
  };

  //---------------------------------get all lead sources-----------------------------------
  const getLeadSources = async () => {
    try {
      const response = await api.post(API_CONFIG.GET_LEAD_SOURCE, {});
      if (response?.data?.LeadSources) {
        setLeadSources(response.data.LeadSources);
      }
    } catch (error) {
      console.log("error in fetching lead sources", error);
    }
  };

  //---------------------------------get all lead types by organisationId-----------------------------------
  const getLeadTypes = async () => {
    try {
      const response = await api.post(API_CONFIG.GET_LEAD_TYPE, {});
      if (response?.data?.LeadTypes) {
        setLeadTypes(response.data.LeadTypes);
      }
    } catch (error) {
      console.log("error in fetching lead types", error);
    }
  };

  const clearFilter = () => {
    setFilterLeadSource("");
    setFilterLeadType("");
    setFilterUser("");
    setFilterStatus("");
  };

  useEffect(() => {
    dispatch(fetchLeadsForAdmin());
    dispatch(fetchUsersByOrganisation());
    getLeadSources();
    getLeadTypes();
  }, []);

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

  useEffect(() => {
    if (selectedLeadId && activeLeadTab === "viewLead") {
      fetchLeadMessages(selectedLeadId);
    }
  }, [activeLeadTab, selectedLeadId]);

  if (loading && activeLeadTab === "displayLead") {
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
    <div className="flex justify-center items-center ">
      {/*---------------------------------------display lead-------------------------------------------------*/}
      {activeLeadTab === "displayLead" && (
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
                onChange={(e) =>
                  handleFilterChange("leadSource", e.target.value)
                }
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
              <select
                value={filterUser}
                onChange={(e) => handleFilterChange("user", e.target.value)}
                className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Filter by User</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
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
                  setActiveLeadTab("addLead");
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
                    <td className="py-2 px-4 border-b">{lead.leadTypeName}</td>
                    <td className="py-2 px-4 border-b">
                      {lead.leadSourceName}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {lead.firstName} {lead.lastName}
                    </td>
                    <td className="py-2 px-4 border-b">{lead.emailId}</td>

                    <td className="py-2 px-4 border-b">{lead.status}</td>
                    <td className="py-2 px-4 border-b">{lead.description}</td>
                    <td className="py-2 px-4 border-b">
                      {processing ? (
                        <button className="mt-6 bg-yellow-400  text-black font-semibold py-2 px-4 rounded">
                          wait...
                        </button>
                      ) : (
                        <span className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedLeadId(lead.id.toString());
                              setActiveLeadTab("viewLead");
                            }}
                            className="mt-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLeadId(lead.id.toString());
                              setEmployeeId(lead.userId.toString());
                              setDescription(lead.description);
                              setLeadTypeId(lead.leadTypeId.toString());
                              setLeadSourceId(lead.leadSourceId.toString());
                              setStatus(lead.status);
                              setActiveLeadTab("updateLead");
                            }}
                            className="mt-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                          >
                            Update
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*---------------------------------------Update leads ---------------------------------------*/}
      {activeLeadTab === "updateLead" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Update Lead{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveLeadTab("displayLead");
              }}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              cancel
            </button>
          </h2>
          <ToastContainer />

          <div>
            <div>lead id: {selectedLeadId}</div>
            {/*----------------------Select Employee Id-----------------------*/}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assign to
              </label>
              <select
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                }}
              >
                {users.map((user) => {
                  return (
                    <option value={user.userId} key={user.userId}>
                      {user.email} {user.firstName} {user.lastName}
                    </option>
                  );
                })}
              </select>
              {employeeIdError && (
                <p className="text-red-500 text-sm">{employeeIdError}</p>
              )}
            </div>

            <div className="flex justify-between">
              {/*----------------------------Select Lead Type-----------------------*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Lead Type
                </label>
                <select
                  value={leadTypeId}
                  onChange={(e) => {
                    setLeadTypeId(e.target.value);
                  }}
                >
                  {leadTypes.map((leadType) => {
                    return (
                      <option value={leadType.id} key={leadType.id}>
                        {leadType.leadTypeName}
                      </option>
                    );
                  })}
                </select>
                {leadTypeIdError && (
                  <p className="text-red-500 text-sm">{leadTypeIdError}</p>
                )}
              </div>

              {/*----------------------Select Lead Source-----------------------*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Lead Source
                </label>
                <select
                  value={leadSourceId}
                  onChange={(e) => {
                    setLeadSourceId(e.target.value);
                  }}
                >
                  {leadSources.map((leadSource) => {
                    return (
                      <option value={leadSource.id} key={leadSource.id}>
                        {leadSource.leadSourceName}
                      </option>
                    );
                  })}
                </select>
                {leadSourceIdError && (
                  <p className="text-red-500 text-sm">{leadSourceIdError}</p>
                )}
              </div>
            </div>
            {/*----------------------Select Lead Status-----------------------*/}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <option value="New">New</option>
                <option value="Discussion">Discussion</option>
                <option value="Hold">Hold</option>
                <option value="Hot">Hot</option>
                <option value="Closed">Closed</option>
              </select>
              {leadSourceIdError && (
                <p className="text-red-500 text-sm">{statusError}</p>
              )}
            </div>

            {/*----------------------Input Lead Description-----------------------*/}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {descriptionError && (
                <p className="text-red-500 text-sm">{descriptionError}</p>
              )}
            </div>
          </div>

          {processing ? (
            <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full">
              wait...
            </button>
          ) : (
            <button
              onClick={() => {
                updateLead(
                  selectedLeadId,
                  employeeId,
                  leadTypeId,
                  leadSourceId,
                  status,
                  description
                );
              }}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Update lead
            </button>
          )}
        </div>
      )}

      {/*---------------------------------------View lead ---------------------------------------*/}
      {activeLeadTab === "viewLead" && selectedLeadId !== null && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-xl mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            View Lead
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveLeadTab("displayLead");
              }}
              className="mt-6 ml-19 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              Back
            </button>
          </h2>
          <ToastContainer />

          <div>
            <div>lead id: {selectedLeadId}</div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Updates:</h3>
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : leadMessages.length > 0 ? (
                <ul className="space-y-2 overflow-auto max-h-64 pr-2">
                  {leadMessages.map((leadMessage) => {
                    const isCurrentUserMessage =
                      leadMessage.userId === loggedInUserId;

                    return (
                      <li
                        key={leadMessage.id}
                        className={`relative p-3 rounded-md shadow ${
                          isCurrentUserMessage
                            ? "bg-blue-200 text-right ml-auto"
                            : "bg-gray-100 text-left mr-auto"
                        }`}
                        style={{ maxWidth: "80%" }}
                      >
                        <p>{leadMessage.message}</p>
                        {leadMessage.createdAt && (
                          <p
                            className={`text-xs text-gray-500 ${
                              isCurrentUserMessage ? "text-right" : "text-left"
                            }`}
                          >
                            {new Date(leadMessage.createdAt).toLocaleString()}
                          </p>
                        )}
                        {leadMessage.User && (
                          <p
                            className={`text-sm text-gray-600 ${
                              isCurrentUserMessage ? "text-right" : "text-left"
                            }`}
                          >
                            By: {leadMessage.User.emailId}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No updates yet.</p>
              )}
            </div>

            {/*----------------------Input New Message-----------------------*/}
            <div>
              <h3 className="text-lg font-semibold mb-2">Add New Message:</h3>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
              {newMessageError && (
                <p className="text-red-500 text-sm">{newMessageError}</p>
              )}
              <button
                onClick={() => handleAddMessage(selectedLeadId)}
                disabled={processing}
                className={`mt-2 bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded ${
                  processing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {processing ? "Adding..." : "Add Message"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*----------------------------------------------------Add lead----------------------------------------------*/}
      {activeLeadTab === "addLead" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Add leads{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveLeadTab("displayLead");
              }}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              cancel
            </button>
          </h2>
          <ToastContainer />

          {/*----------------------Select Employee Id-----------------------*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign to
            </label>
            <select
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
              }}
            >
              <option value="">-select-</option>
              {users.map((user) => {
                return (
                  <option value={user.userId} key={user.userId}>
                    {user.email}&nbsp;|&nbsp;{user.firstName}&nbsp;
                    {user.lastName}
                  </option>
                );
              })}
            </select>
            {employeeIdError && (
              <p className="text-red-500 text-sm">{employeeIdError}</p>
            )}
          </div>

          <div className="flex justify-between">
            {/*----------------------Select Lead Type-----------------------*/}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Lead Type
              </label>
              <select
                value={leadTypeId}
                onChange={(e) => {
                  setLeadTypeId(e.target.value);
                }}
              >
                <option value="">-select-</option>
                {leadTypes.map((leadType) => {
                  return (
                    <option value={leadType.id} key={leadType.id}>
                      {leadType.leadTypeName}
                    </option>
                  );
                })}
              </select>
              {leadTypeIdError && (
                <p className="text-red-500 text-sm">{leadTypeIdError}</p>
              )}
            </div>

            {/*----------------------Select Lead Source-----------------------*/}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Lead Source
              </label>
              <select
                value={leadSourceId}
                onChange={(e) => {
                  setLeadSourceId(e.target.value);
                }}
              >
                <option value="">-select-</option>
                {leadSources.map((leadSource) => {
                  return (
                    <option value={leadSource.id} key={leadSource.id}>
                      {leadSource.leadSourceName}
                    </option>
                  );
                })}
              </select>
              {leadSourceIdError && (
                <p className="text-red-500 text-sm">{leadSourceIdError}</p>
              )}
            </div>
          </div>
          {/*----------------------Select Lead Status-----------------------*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              <option value="">-select-</option>
              <option value="New">New</option>
              <option value="Discussion">Discussion</option>
              <option value="Hold">Hold</option>
              <option value="Hot">Hot</option>
              <option value="Closed">Closed</option>
            </select>
            {leadSourceIdError && (
              <p className="text-red-500 text-sm">{statusError}</p>
            )}
          </div>

          {/*----------------------Input Lead Description-----------------------*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {descriptionError && (
              <p className="text-red-500 text-sm">{descriptionError}</p>
            )}
          </div>

          {processing ? (
            <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full">
              wait...
            </button>
          ) : (
            <button
              disabled={processing}
              onClick={() => {
                resetError();
                addLead(
                  employeeId,
                  leadTypeId,
                  leadSourceId,
                  status,
                  description
                );
              }}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Add leads
            </button>
          )}
        </div>
      )}
    </div>
  );
}
