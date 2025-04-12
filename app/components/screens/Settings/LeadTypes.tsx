"use client";
import { useState, useEffect } from "react";
const { toast, ToastContainer } = require("react-toastify");
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface LeadType {
  id: number;
  leadTypeName: string;
}

export function LeadTypes() {
  const [activeLeadTypeTab, setActiveLeadTypeTab] = useState("displayLeadType");

  const [leadTypes, setLeadTypes] = useState<LeadType[]>([]);
  const [leadTypeName, setLeadTypeName] = useState("");
  const [updateId, setUpdateId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [leadTypeNameError, setLeadTypeNameError] = useState("");

  //-----------------------validations-----------------------------------
  const isValid = () => {
    if (leadTypeName.trim() === "") {
      setLeadTypeNameError("Lead Name is required");
      return false;
    }
    return true;
  };

  //--------------------------reset variables--------------------------
  const resetVariables = () => {
    setLeadTypeName("");
    setUpdateId(0);
  };

  //-----------------------------reset error---------------------------------
  const resetError = () => {
    setLeadTypeNameError("");
  };

  //---------------------------------get all lead types-----------------------------------
  const getLeadTypes = async () => {
    try {
      setLoading(true);
      const response = await api.post(API_CONFIG.GET_LEAD_TYPE, {});
      if (response.data) {
        setLeadTypes(response.data.data);
      }
    } catch (error) {
      console.log("error in fetching lead types", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------add new lead type-----------------------------------
  const addLeadTypes = async () => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_LEAD_TYPE, {
        leadTypeName,
      });
      toast.success("added lead type");

      setTimeout(() => {
        resetVariables();
        resetError();
        setProcessing(false);
        setActiveLeadTypeTab("displayLeadType");
        getLeadTypes();
      }, 600);
    } catch (error) {
      console.log("error in adding lead type", error);
      toast.error("error in adding lead type");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //---------------------------------------------update lead type---------------------------------
  const updateLeadTypes = async (updateId: number, leadTypeName: string) => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.UPDATE_LEAD_TYPE, {
        id: updateId,
        leadTypeName,
      });
      toast.success("updated lead type");

      setTimeout(() => {
        setProcessing(false);
        setActiveLeadTypeTab("displayLeadType");
        resetVariables();
        resetError();
        getLeadTypes();
      }, 600);
    } catch (error) {
      console.log("error in updating lead type", error);
      toast.error("Lead Type not updated");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };
  //---------------------------------------------delete lead type---------------------------------
  const deleteLeadTypes = async (leadId: number) => {
    try {
      setProcessing(true);
      const response = await api.post(API_CONFIG.DELETE_LEAD_TYPE, {
        id: leadId,
      });
      toast.success("deleted lead type");
      setTimeout(() => {
        setProcessing(false);
        getLeadTypes();
      }, 600);
    } catch (error) {
      console.log("error in deleting lead type", error);
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
      {/*-----------------------------display lead type-----------------------------*/}
      {activeLeadTypeTab === "displayLeadType" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Lead Types{" "}
            <button
              onClick={() => setActiveLeadTypeTab("addLeadType")}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              Add Lead Type
            </button>
          </h2>
          <ToastContainer />

          {leadTypes.length > 0 ? (
            leadTypes.map((leadType: LeadType) => (
              <div key={leadType.id}>
                {leadType.id}: {leadType.leadTypeName}
                {processing ? (
                  <button className="mt-6 bg-yellow-100  text-black font-semibold py-2 px-4 rounded">
                    wait...
                  </button>
                ) : (
                  <span>
                    <button
                      onClick={() => deleteLeadTypes(leadType.id)}
                      className="m-2 bg-yellow-100 hover:bg-yellow-500 text-black font-semibold py-2 px-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setUpdateId(leadType.id);
                        setLeadTypeName(leadType.leadTypeName);
                        setActiveLeadTypeTab("updateLeadType");
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

      {/*-----------------------------Update lead type-----------------------------*/}
      {activeLeadTypeTab === "updateLeadType" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Update Lead Type{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveLeadTypeTab("displayLeadType");
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
              value={leadTypeName}
              onChange={(e) => setLeadTypeName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {leadTypeNameError && (
              <p className="text-red-500 text-sm">{leadTypeNameError}</p>
            )}
          </div>

          {processing ? (
            <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full">
              wait...
            </button>
          ) : (
            <button
              onClick={() => {
                updateLeadTypes(updateId, leadTypeName);
              }}
              className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Update Lead Type
            </button>
          )}
        </div>
      )}

      {/*-----------------------------Add lead type-----------------------------*/}
      {activeLeadTypeTab === "addLeadType" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Add Lead Types{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveLeadTypeTab("displayLeadType");
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
              Lead Name
            </label>
            <input
              type="text"
              value={leadTypeName}
              onChange={(e) => setLeadTypeName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {leadTypeNameError && (
              <p className="text-red-500 text-sm">{leadTypeNameError}</p>
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
              Add Lead Types
            </button>
          )}
        </div>
      )}
    </div>
  );
}
