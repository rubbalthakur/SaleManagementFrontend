"use client";
import { useState, useEffect } from "react";
const { toast, ToastContainer } = require("react-toastify");
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface LeadSource {
  id: number;
  leadSourceName: string;
}

export function LeadSources() {
  const [activeLeadSourceTab, setActiveLeadSourceTab] =
    useState("displayLeadSource");

  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [leadSourceName, setLeadSourceName] = useState("");
  const [updateId, setUpdateId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [leadSourceNameError, setLeadSourceNameError] = useState("");

  //-----------------------validations-----------------------------------
  const isValid = () => {
    if (leadSourceName.trim() === "") {
      setLeadSourceNameError("Lead Source Name is required");
      return false;
    }
    return true;
  };

  //--------------------------reset variables--------------------------
  const resetVariables = () => {
    setLeadSourceName("");
    setUpdateId(0);
  };

  //-----------------------------reset error---------------------------------
  const resetError = () => {
    setLeadSourceNameError("");
  };

  //---------------------------------get all lead sources-----------------------------------
  const getLeadTypes = async () => {
    try {
      setLoading(true);
      const response = await api.post(API_CONFIG.GET_LEAD_SOURCE, {});
      if (response.status >= 200 && response.status < 300) {
        setLeadSources(response.data.data);
        console.log("these are lead sources--------------", leadSources);
      }
    } catch (error) {
      console.log("error in fetching lead sources", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------add new lead source-----------------------------------
  const addLeadTypes = async () => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_LEAD_SOURCE, {
        leadSourceName,
      });
      toast.success("added lead source");

      setTimeout(() => {
        resetVariables();
        resetError();
        setProcessing(false);
        setActiveLeadSourceTab("displayLeadSource");
        getLeadTypes();
      }, 600);
    } catch (error) {
      console.log("error in adding lead source", error);
      toast.error("error in adding lead source");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //---------------------------------------------update lead source---------------------------------
  const updateLeadSources = async (
    updateId: number,
    leadSourceName: string
  ) => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.UPDATE_LEAD_SOURCE, {
        id: updateId,
        leadSourceName,
      });
      toast.success("updated lead source");

      setTimeout(() => {
        setProcessing(false);
        setActiveLeadSourceTab("displayLeadSource");
        resetVariables();
        resetError();
        getLeadTypes();
      }, 600);
    } catch (error) {
      console.log("error in updating lead source", error);
      toast.error("Lead Type not updated");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };
  //---------------------------------------------delete lead source---------------------------------
  const deleteLeadTypes = async (leadId: number) => {
    try {
      setProcessing(true);
      const response = await api.post(API_CONFIG.DELETE_LEAD_SOURCE, {
        id: leadId,
      });
      toast.success("deleted lead source");
      setTimeout(() => {
        setProcessing(false);
        getLeadTypes();
      }, 600);
    } catch (error) {
      console.log("error in deleting lead source", error);
      toast.error("Lead Type not deleted");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  useEffect(() => {
    getLeadTypes();
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
      {/*-----------------------------display lead source-----------------------------*/}
      {activeLeadSourceTab === "displayLeadSource" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Lead Types{" "}
            <button
              onClick={() => setActiveLeadSourceTab("addLeadType")}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              Add LeadSource
            </button>
          </h2>
          <ToastContainer />

          {leadSources.length > 0 ? (
            leadSources.map((leadSource: LeadSource) => (
              <div key={leadSource.id}>
                {leadSource.id}: {leadSource.leadSourceName}
                {processing ? (
                  <button className="mt-6 bg-yellow-100  text-black font-semibold py-2 px-4 rounded">
                    wait...
                  </button>
                ) : (
                  <span>
                    <button
                      onClick={() => deleteLeadTypes(leadSource.id)}
                      className="m-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setUpdateId(leadSource.id);
                        setLeadSourceName(leadSource.leadSourceName);
                        setActiveLeadSourceTab("updateLeadSource");
                      }}
                      className="mt-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                    >
                      Update
                    </button>
                  </span>
                )}
              </div>
            ))
          ) : (
            <div>No lead Types found</div>
          )}
        </div>
      )}

      {/*-----------------------------Update lead source-----------------------------*/}
      {activeLeadSourceTab === "updateLeadSource" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Update Lead Type{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveLeadSourceTab("displayLeadSource");
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
              Lead Type
            </label>
            <input
              type="text"
              value={leadSourceName}
              onChange={(e) => setLeadSourceName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {leadSourceNameError && (
              <p className="text-red-500 text-sm">{leadSourceNameError}</p>
            )}
          </div>

          {processing ? (
            <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full">
              wait...
            </button>
          ) : (
            <button
              onClick={() => {
                updateLeadSources(updateId, leadSourceName);
              }}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Update Lead Type
            </button>
          )}
        </div>
      )}

      {/*-----------------------------Add lead source-----------------------------*/}
      {activeLeadSourceTab === "addLeadType" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Add Lead Source{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveLeadSourceTab("displayLeadSource");
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
              Lead Source
            </label>
            <input
              type="text"
              value={leadSourceName}
              onChange={(e) => setLeadSourceName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {leadSourceNameError && (
              <p className="text-red-500 text-sm">{leadSourceNameError}</p>
            )}
          </div>

          {processing ? (
            <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full">
              wait...
            </button>
          ) : (
            <button
              onClick={addLeadTypes}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Add Lead Sources
            </button>
          )}
        </div>
      )}
    </div>
  );
}
