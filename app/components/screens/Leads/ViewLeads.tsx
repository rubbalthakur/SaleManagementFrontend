"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

import { toast, ToastContainer } from "react-toastify";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { LeadMessage } from "@/types/LeadMessage";

interface Props {
  setActiveLeadTab: (
    tab: "displayLead" | "addLead" | "updateLead" | "viewLead"
  ) => void;
  selectedLeadId: number | null;
  setSelectedLeadId: (id: number | null) => void;
}

export function ViewLeads({
  setActiveLeadTab,
  selectedLeadId,
  setSelectedLeadId,
}: Props) {
  const loggedInUserId = useSelector(
    (state: RootState) => state.auth.loggedInUserId
  );

  const [leadMessages, setLeadMessages] = useState<LeadMessage[] | []>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [newMessageError, setNewMessageError] = useState<string>("");

  //----------------------------fetch Lead Messages----------------------------------
  const fetchLeadMessages = async (leadId: number) => {
    try {
      setLoadingMessages(true);
      const response = await api.post(API_CONFIG.GET_LEAD_MESSAGES, {
        leadId,
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
  const handleAddMessage = async (selectedLeadId: number) => {
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
        leadId: selectedLeadId,
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

  useEffect(() => {
    if (selectedLeadId) {
      fetchLeadMessages(selectedLeadId);
    }
  }, []);

  if (!selectedLeadId) {
    return <h1>Lead Id not selected</h1>;
  }

  return (
    <>
      {/*---------------------------------------View lead ---------------------------------------*/}
      <div className="border rounded-lg shadow-md p-8 w-full max-w-xl mx-4 my-4">
        <h2 className="text-2xl font-semibold mb-4">
          View Lead
          <button
            onClick={() => {
              setSelectedLeadId(null);
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
    </>
  );
}
