"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import {
  fetchLeadsForAdmin,
  fetchLeadsForUser,
} from "@/app/store/features/leads/leadService";
import { fetchUsersByOrganisation } from "@/app/store/features/users/userSlice";
import { fetchLeadSourcesByOrganisation } from "@/app/store/features/leadSources/leadSourceService";
import { fetchLeadTypesByOrganisation } from "@/app/store/features/leadTypes/leadTypeService";
import { Lead } from "@/types/Lead";

import { DisplayLeads } from "./DisplayLeads";
import { EditLeads } from "./EditLeads";
import { ViewLeads } from "./ViewLeads";
import { AddLeads } from "./AddLeads";

export function Leads() {
  const dispatch = useDispatch<AppDispatch>();
  const roleId = useSelector((state: RootState) => state.auth.roleId);
  const error = useSelector((state: RootState) => state.leads.error);

  const [activeLeadTab, setActiveLeadTab] = useState<
    "displayLead" | "addLead" | "updateLead" | "viewLead"
  >("displayLead");

  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [leadTypeId, setLeadTypeId] = useState<number | null>(null);
  const [leadSourceId, setLeadSourceId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [descriptionError, setDescriptionError] = useState<string>("");
  const [employeeIdError, setEmployeeIdError] = useState<string>("");
  const [leadSourceIdError, setLeadSourceIdError] = useState<string>("");
  const [leadTypeIdError, setLeadTypeIdError] = useState<string>("");
  const [statusError, setStatusError] = useState<string>("");

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
    setSelectedLeadId(null);
    setEmployeeId(null);
    setLeadTypeId(null);
    setLeadSourceId(null);
    setStatus("");
    setDescription("");
  };

  //-----------------------------reset error---------------------------------
  const resetError = () => {
    setDescriptionError("");
    setEmployeeIdError("");
    setLeadSourceIdError("");
    setLeadTypeIdError("");
    setStatusError("");
  };

  //---------------props functions for display leads---------------------------
  const onEdit = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setEmployeeId(lead.userId);
    setDescription(lead.description);
    setLeadTypeId(lead.leadTypeId);
    setLeadSourceId(lead.leadSourceId);
    setStatus(lead.status);
    setActiveLeadTab("updateLead");
  };

  const onAdd = () => {
    setActiveLeadTab("addLead");
  };

  const onView = (lead: Lead) => {
    setActiveLeadTab("viewLead");
    setSelectedLeadId(lead.id);
  };

  useEffect(() => {
    if (roleId === 1) {
      dispatch(fetchLeadsForAdmin());
    } else {
      dispatch(fetchLeadsForUser());
    }
    dispatch(fetchUsersByOrganisation());
    dispatch(fetchLeadSourcesByOrganisation());
    dispatch(fetchLeadTypesByOrganisation());
  }, []);

  if (!roleId) {
    return <div>Role is not defined</div>;
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
      {/*---------------------------------------display lead---------------------------------------*/}
      {activeLeadTab === "displayLead" && (
        <DisplayLeads onEdit={onEdit} onAdd={onAdd} onView={onView} />
      )}

      {/*---------------------------------------Update leads ---------------------------------------*/}
      {activeLeadTab === "updateLead" && (
        <EditLeads
          setActiveLeadTab={setActiveLeadTab}
          selectedLeadId={selectedLeadId}
          employeeId={employeeId}
          leadTypeId={leadTypeId}
          leadSourceId={leadSourceId}
          status={status}
          description={description}
          setEmployeeId={setEmployeeId}
          setLeadTypeId={setLeadTypeId}
          setLeadSourceId={setLeadSourceId}
          setStatus={setStatus}
          setDescription={setDescription}
          isValid={isValid}
          resetVariables={resetVariables}
          resetError={resetError}
          descriptionError={descriptionError}
          employeeIdError={employeeIdError}
          leadSourceIdError={leadSourceIdError}
          leadTypeIdError={leadTypeIdError}
          statusError={statusError}
        />
      )}

      {/*---------------------------------------View lead ---------------------------------------*/}
      {activeLeadTab === "viewLead" && (
        <ViewLeads
          setActiveLeadTab={setActiveLeadTab}
          selectedLeadId={selectedLeadId}
          setSelectedLeadId={setSelectedLeadId}
        />
      )}

      {/*---------------------------------------Add lead----------------------------------------------*/}
      {activeLeadTab === "addLead" && (
        <AddLeads
          setActiveLeadTab={setActiveLeadTab}
          employeeId={employeeId}
          leadTypeId={leadTypeId}
          leadSourceId={leadSourceId}
          status={status}
          description={description}
          setEmployeeId={setEmployeeId}
          setLeadTypeId={setLeadTypeId}
          setLeadSourceId={setLeadSourceId}
          setStatus={setStatus}
          setDescription={setDescription}
          isValid={isValid}
          resetVariables={resetVariables}
          resetError={resetError}
          descriptionError={descriptionError}
          employeeIdError={employeeIdError}
          leadSourceIdError={leadSourceIdError}
          leadTypeIdError={leadTypeIdError}
          statusError={statusError}
        />
      )}
    </div>
  );
}
