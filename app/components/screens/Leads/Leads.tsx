"use client";
import { useState, useEffect } from "react";
const { toast, ToastContainer } = require("react-toastify");
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface Lead {
  id: number;
  userId: number;
  organisationId: number;
  leadTypeId: number;
  leadSourceId: number;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  status: string;
  leadTypeName: string;
  leadSourceName: string;
}

export function Leads() {
  const [activeLeadTab, setActiveLeadTab] = useState("displayLead");

  const [leads, setLeads] = useState<Lead[]>([]);

  const [employeeId, setEmployeeId] = useState("");

  const [leadTypeId, setLeadTypeId] = useState("");
  const [leadSourceId, setLeadSourceId] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [updateId, setUpdateId] = useState("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [descriptionError, setDescriptionError] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");

  //-----------------------validations-----------------------------------
  const isValid = () => {
    if (description.trim() === "") {
      setDescriptionError("Lead Name is required");
      return false;
    }
    return true;
  };

  //--------------------------reset variables--------------------------
  const resetVariables = () => {
    setDescription("");
    setUpdateId("");
    setEmployeeId("");
    setLeadTypeId("");
    setLeadSourceId("");
    setStatus("");
  };

  //-----------------------------reset error---------------------------------
  const resetError = () => {
    setDescriptionError("");
    setEmployeeIdError("");
  };

  //---------------------------------get all leads-----------------------------------
  const getLeads = async () => {
    try {
      setLoading(true);
      const response = await api.post(API_CONFIG.GET_ALL_LEAD, {});
      if (response.data) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.log("error in fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------add new lead-----------------------------------
  const addLead = async (employeeId: string, description: string) => {
    try {
      if (!isValid()) return;
      if (!employeeId) {
        setEmployeeIdError("please add employeeId");
        return;
      }

      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_LEAD, {
        employeeId,
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
        getLeads();
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
  const updateLead = async (updateId: string, description: string) => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.UPDATE_LEAD, {
        id: updateId,
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
        getLeads();
      }, 600);
    } catch (error) {
      console.log("error in updating lead", error);
      toast.error("lead not updated");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };
  //---------------------------------------------delete lead---------------------------------
  const deleteLead = async (leadId: number) => {
    try {
      setProcessing(true);
      const response = await api.post(API_CONFIG.DELETE_LEAD, {
        id: leadId,
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success("deleted lead");
      } else {
        toast.error("lead not deleted");
      }
      setTimeout(() => {
        setProcessing(false);
        getLeads();
      }, 600);
    } catch (error) {
      console.log("error in deleting lead", error);
      toast.error("lead not deleted");
      setTimeout(() => {
        setProcessing(false);
        setActiveLeadTab("displayLead");
        resetVariables();
        resetError();
        getLeads();
      }, 600);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {/*---------------------------------------display lead-------------------------------------------------*/}
      {activeLeadTab === "displayLead" && (
        <div className="border rounded-lg shadow-md p-8 w-full mx-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Leads{" "}
            <button
              onClick={() => setActiveLeadTab("addLead")}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              Add Lead
            </button>
          </h2>
          <ToastContainer />
          {/* <div>Id &nbsp;userId&nbsp;&nbsp;&nbsp;description </div> */}

          {leads.length > 0 ? (
            leads.map((lead: Lead) => (
              <div key={lead.id}>
                {lead.id}: &nbsp;&nbsp;{lead.leadTypeName}&nbsp;&nbsp;|&nbsp;
                {lead.leadSourceName}&nbsp;&nbsp;|&nbsp;
                {lead.description}&nbsp;&nbsp;|&nbsp;
                {lead.email}&nbsp;&nbsp;|&nbsp;
                {lead.firstName}
                {lead.lastName}&nbsp;&nbsp;|&nbsp;{lead.status}
                {processing ? (
                  <button className="mt-6 bg-yellow-400  text-black font-semibold py-2 px-4 rounded">
                    wait...
                  </button>
                ) : (
                  <span>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="m-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setUpdateId(lead.id.toString());
                        setDescription(lead.description);
                        setLeadTypeId(lead.leadTypeId.toString());
                        setLeadSourceId(lead.leadSourceId.toString());
                        setActiveLeadTab("updateLead");
                        setStatus(lead.status);
                      }}
                      className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                    >
                      Update
                    </button>
                  </span>
                )}
                <hr></hr>
              </div>
            ))
          ) : (
            <div>No leads found</div>
          )}
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
            <div>lead id: {updateId}</div>
            <label className="block text-sm font-medium text-gray-700">
              Lead Name
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
              onClick={() => {
                updateLead(updateId, description);
              }}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Update lead
            </button>
          )}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Id
            </label>
            <input
              type="number"
              value={employeeId ? employeeId : ""}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {employeeIdError && (
              <p className="text-red-500 text-sm">{employeeIdError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lead Name
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
              onClick={() => {
                addLead(employeeId, description);
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
