"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import {
  fetchLeadsForAdmin,
  fetchLeadsForUser,
  updateLead,
} from "@/app/store/features/leads/leadService";

import { toast, ToastContainer } from "react-toastify";

interface Props {
  setActiveLeadTab: (
    tab: "displayLead" | "addLead" | "updateLead" | "viewLead"
  ) => void;
  selectedLeadId: number | null;
  employeeId: number | null;
  leadTypeId: number | null;
  leadSourceId: number | null;
  status: string;
  description: string;
  setEmployeeId: (id: number | null) => void;
  setLeadTypeId: (id: number | null) => void;
  setLeadSourceId: (id: number | null) => void;
  setStatus: (status: string) => void;
  setDescription: (description: string) => void;
  isValid: () => boolean;
  resetVariables: () => void;
  resetError: () => void;
  descriptionError: string;
  employeeIdError: string;
  leadSourceIdError: string;
  leadTypeIdError: string;
  statusError: string;
}

export function EditLeads({
  setActiveLeadTab,
  selectedLeadId,
  employeeId,
  leadTypeId,
  leadSourceId,
  status,
  description,
  setEmployeeId,
  setLeadTypeId,
  setLeadSourceId,
  setStatus,
  setDescription,
  isValid,
  resetVariables,
  resetError,
  descriptionError,
  employeeIdError,
  leadSourceIdError,
  leadTypeIdError,
  statusError,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const allLeads = useSelector((state: RootState) => state.leads.leads);
  const roleId = useSelector((state: RootState) => state.auth.roleId);
  const loggedInUserId = useSelector(
    (state: RootState) => state.auth.loggedInUserId
  );
  const users = useSelector((state: RootState) => state.users.users);
  const leadSources = useSelector(
    (state: RootState) => state.leadSources.leadSources
  );
  const leadTypes = useSelector(
    (state: RootState) => state.leadTypes.leadTypes
  );
  const processing = useSelector((state: RootState) => state.leads.processing);

  //---------------------------------------------update lead function ---------------------------------
  const handleUpdateLead = async () => {
    if (!isValid()) return;
    if (!selectedLeadId) return;

    const resultAction = await dispatch(
      updateLead({
        id: selectedLeadId,
        employeeId,
        leadTypeId,
        leadSourceId,
        status,
        description,
      })
    );
    if (updateLead.fulfilled.match(resultAction)) {
      toast.success("updated lead");
      if (roleId === 1) {
        dispatch(fetchLeadsForAdmin());
      } else {
        dispatch(fetchLeadsForUser());
      }
      setTimeout(() => {
        resetVariables();
        resetError();
        setActiveLeadTab("displayLead");
      }, 600);
    } else if (updateLead.rejected.match(resultAction)) {
      toast.error("Failed to update Lead");
    }
  };

  useEffect(() => {
    if (roleId !== 1) {
      setEmployeeId(loggedInUserId);
    }
  }, [roleId]);

  return (
    <>
      {/*---------------------------------------Update leads ---------------------------------------*/}

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
            {roleId === 1 ? (
              <select
                value={employeeId?.toString()}
                onChange={(e) => {
                  setEmployeeId(parseInt(e.target.value));
                }}
              >
                {users.map((user) => {
                  return (
                    <option value={user.userId} key={user.userId}>
                      {user.User.emailId} {user.User.firstName}{" "}
                      {user.User.lastName}
                    </option>
                  );
                })}
              </select>
            ) : (
              <div>
                ({allLeads[0].User.emailId}) {allLeads[0].User.firstName}{" "}
                {allLeads[0].User.lastName}
              </div>
            )}
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
                value={leadTypeId?.toString()}
                onChange={(e) => {
                  setLeadTypeId(parseInt(e.target.value));
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
                value={leadSourceId?.toString()}
                onChange={(e) => {
                  setLeadSourceId(parseInt(e.target.value));
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
              handleUpdateLead();
            }}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
          >
            Update lead
          </button>
        )}
      </div>
    </>
  );
}
