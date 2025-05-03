"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLeadSourcesByOrganisation } from "@/app/store/features/leadSources/leadSourceSlice";
import { RootState, AppDispatch } from "@/app/store/store";

import { toast, ToastContainer } from "react-toastify";
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
  const [leadSourceName, setLeadSourceName] = useState<string>("");
  const [updateId, setUpdateId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [leadSourceNameError, setLeadSourceNameError] = useState<string>("");

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
  const getLeadSources = async () => {
    try {
      setLoading(true);
      const response = await api.post(API_CONFIG.GET_LEAD_SOURCE, {});
      if (response?.data?.LeadSources) {
        setLeadSources(response.data.LeadSources);
      }
    } catch (error) {
      console.log("error in fetching lead sources", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------add new lead source-----------------------------------
  const addLeadSources = async () => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_LEAD_SOURCE, {
        leadSourceName,
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success("added lead source");
      } else {
        toast.error("failed to add lead source");
      }

      setTimeout(() => {
        resetVariables();
        resetError();
        setProcessing(false);
        setActiveLeadSourceTab("displayLeadSource");
        getLeadSources();
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
      if (response.status >= 200 && response.status < 300) {
        toast.success("updated lead source");
      } else {
        toast.error("failed to update lead source");
      }

      setTimeout(() => {
        setProcessing(false);
        setActiveLeadSourceTab("displayLeadSource");
        resetVariables();
        resetError();
        getLeadSources();
      }, 600);
    } catch (error) {
      console.log("error in updating lead source", error);
      toast.error("Lead Source not updated");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  useEffect(() => {
    getLeadSources();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      {/*-----------------------------display lead source-----------------------------*/}
      {activeLeadSourceTab === "displayLeadSource" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Lead Sources{" "}
            <button
              onClick={() => setActiveLeadSourceTab("addLeadSource")}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              Add More
            </button>
          </h2>
          <ToastContainer />

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadSources.length > 0 ? (
                  leadSources.map((leadSource: LeadSource) => (
                    <tr key={leadSource.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{leadSource.id}</td>
                      <td className="py-2 px-4 border-b">
                        {leadSource.leadSourceName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {processing ? (
                          <button className="mt-6 bg-yellow-100  text-black font-semibold py-2 px-4 rounded">
                            wait...
                          </button>
                        ) : (
                          <span>
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No lead Sources found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/*-----------------------------Update lead source-----------------------------*/}
      {activeLeadSourceTab === "updateLeadSource" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Update Lead Source{" "}
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
              onClick={() => {
                updateLeadSources(updateId, leadSourceName);
              }}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Update Lead Source
            </button>
          )}
        </div>
      )}

      {/*-----------------------------Add lead source-----------------------------*/}
      {activeLeadSourceTab === "addLeadSource" && (
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
              onClick={addLeadSources}
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
