"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface Props {
  roleId: number;
}

interface Proposal {
  id: number;
  organisationId: number;
  clientId: number;
  leadId: number;
  cost: number;
  status: string;
  emailId: string;
  firstName: string;
  lastName: string;
  leadDescription: string;
}
interface ProposalClient {
  id: number;
  organisationId: number;
  clientId: number;
  leadId: number;
  cost: number;
  status: string;
  Client: {
    emailId: string;
    firstName: string;
    lastName: string;
  };
  Lead: {
    description: string;
  };
}

interface Client {
  id: number;
  organisationId: number;
  firstName: string;
  lastName: string;
  emailId: string;
  city: string;
  state: string;
  country: string;
  contact: string;
}

interface Lead {
  id: number;
  description: string;
  Proposal?: {
    id: number;
    organisationId: number;
    clientId: number;
    leadId: number;
    cost: number;
    status: string;
    emailId: string;
    firstName: string;
    lastName: string;
    leadDescription: string;
    Client: {
      emailId: string;
      firstName: string;
      lastName: string;
    };
  };
}

export function Analytics({ roleId }: Props) {
  const [activeProposalTab, setActiveProposalTab] = useState<
    "displayProposal" | "addProposal" | "updateProposal"
  >("displayProposal");

  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  const [filterClient, setFilterClient] = useState<string>("");

  const [clientId, setClientId] = useState<string>("");
  const [leadId, setLeadId] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [selectedProposalId, setSelectedProposalId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [clientIdError, setClientIdError] = useState<string>("");
  const [leadIdError, setLeadIdError] = useState<string>("");
  const [costError, setCostError] = useState<string>("");
  const [statusError, setStatusError] = useState<string>("");

  //-----------------------validations-----------------------------------
  const isValid = () => {
    if (!clientId) {
      setClientIdError("Client Id is required");
      return false;
    }
    if (!leadId) {
      setLeadIdError("LeadId is required");
      return false;
    }
    if (status.trim() === "") {
      setStatusError("status is required");
      return false;
    }
    if (!cost) {
      setCostError("Cost is required");
      return false;
    }
    return true;
  };

  //--------------------------reset variables--------------------------
  const resetVariables = () => {
    setStatus("");
    setSelectedProposalId("");
    setClientId("");
    setLeadId("");
    setCost("");
  };

  //-----------------------------reset error---------------------------------
  const resetError = () => {
    setClientIdError("");
    setLeadIdError("");
    setCostError("");
    setStatusError("");
  };

  //---------------------------------get all proposals----------------------------------
  const fetchProposals = async () => {
    try {
      setLoading(true);
      //---------for admin----------------
      if (roleId === 1) {
        const response = await api.post(
          API_CONFIG.GET_ALL_PROPOSALS_BY_ORGANISATION
        );
        if (
          response.data?.OrganisationProfile?.Proposals &&
          Object.keys(response.data.OrganisationProfile.Proposals).length > 0
        ) {
          const proposalData = response.data.OrganisationProfile.Proposals.map(
            (proposal: ProposalClient) => ({
              id: proposal.id,
              organisationId: proposal.organisationId,
              clientId: proposal.clientId,
              leadId: proposal.leadId,
              cost: proposal.cost,
              status: proposal.status,
              emailId: proposal.Client.emailId,
              firstName: proposal.Client.firstName,
              lastName: proposal.Client.lastName,
              leadDescription: proposal.Lead.description,
            })
          );
          setAllProposals(proposalData);
          setFilteredProposals(proposalData);
        }
      } else {
        //-----------------for employee------------------------
        const response = await api.post(API_CONFIG.GET_ALL_PROPOSALS_BY_USER);
        if (
          response.data?.User?.Leads &&
          Object.keys(response.data.User.Leads).length > 0
        ) {
          const allProposalData = response.data.User.Leads.filter(
            (lead: Lead) => lead.Proposal
          );
          const proposalData = allProposalData.map((lead: Lead) => ({
            id: lead.Proposal?.id,
            organisationId: lead.Proposal?.organisationId,
            clientId: lead.Proposal?.clientId,
            leadId: lead.Proposal?.leadId,
            cost: lead.Proposal?.cost,
            status: lead.Proposal?.status,
            emailId: lead.Proposal?.Client.emailId,
            firstName: lead.Proposal?.Client.firstName,
            lastName: lead.Proposal?.Client.lastName,
            leadDescription: lead.description,
          }));
          setAllProposals(proposalData);
          setFilteredProposals(proposalData);
        }
      }
    } catch (error) {
      console.log("error in fetching proposals", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------add new proposal-----------------------------------
  const addProposal = async (
    clientId: string,
    leadId: string,
    cost: string,
    status: string
  ) => {
    try {
      if (!isValid()) return;

      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_PROPOSAL, {
        clientId: parseInt(clientId),
        leadId: parseInt(leadId),
        cost: parseInt(cost),
        status,
      });
      if (response.status >= 200 && response.status < 300) {
        toast.success("added client");
      } else {
        toast.error("client not added");
      }

      setTimeout(() => {
        resetVariables();
        resetError();
        setProcessing(false);
        setActiveProposalTab("displayProposal");
        fetchProposals();
      }, 600);
    } catch (error) {
      console.log("error in adding client", error);
      toast.error("error in adding client");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //---------------------------------------------update Proposal---------------------------------
  const updateProposal = async (
    selectedProposalId: string,
    clientId: string,
    leadId: string,
    cost: string,
    status: string
  ) => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.UPDATE_PROPOSAL, {
        id: parseInt(selectedProposalId),
        clientId: parseInt(clientId),
        leadId: parseInt(leadId),
        cost: parseInt(cost),
        status,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success("updated client");
      } else {
        toast.error("client not updated");
      }

      setTimeout(() => {
        resetVariables();
        resetError();
        setProcessing(false);
        setActiveProposalTab("displayProposal");
        fetchProposals();
      }, 600);
    } catch (error) {
      console.log("error in updating client", error);
      toast.error("client not updated");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //---------------------------------get all clients-----------------------------------
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        API_CONFIG.GET_ALL_CLIENT_BY_ORGANISATION
      );
      if (
        response.data?.OrganisationProfile?.Clients &&
        Object.keys(response.data.OrganisationProfile.Clients).length > 0
      ) {
        const clientData = response.data.OrganisationProfile.Clients.map(
          (client: Client) => ({
            id: client.id,
            organisationId: client.organisationId,
            emailId: client.emailId,
            firstName: client.firstName,
            lastName: client.lastName,
            city: client.city,
            state: client.state,
            country: client.country,
            contact: client.contact,
          })
        );
        setClients(clientData);
      }
    } catch (error) {
      console.log("error in fetching clients", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------get all leads-----------------------------------
  const fetchLeads = async () => {
    try {
      setLoading(true);
      if (roleId === 1) {
        //-------for admin---------------
        const response = await api.post(
          API_CONFIG.GET_ALL_LEAD_BY_ORGANISATION,
          {}
        );
        if (
          response.data &&
          response.data.Leads &&
          Object.keys(response.data.Leads).length > 0
        ) {
          const leadData = response.data.Leads.map((leadUser: Lead) => ({
            id: leadUser.id,
            description: leadUser.description,
          }));
          setLeads(leadData);
        }
      } else {
        //--------------for user------------------
        const response = await api.post(API_CONFIG.GET_LEAD_BY_USER, {});
        if (response.data && Object.keys(response.data).length > 0) {
          const leadData = response.data.map((leadUser: Lead) => ({
            id: leadUser.id,
            description: leadUser.description,
          }));
          setLeads(leadData);
        }
      }
    } catch (error) {
      console.log("error in fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setFilterClient("");
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "client") {
      setFilterClient(value);
    }
  };

  useEffect(() => {
    fetchProposals();
    fetchClients();
    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = [...allProposals];
    if (filterClient) {
      filtered = filtered.filter(
        (proposal) => proposal.clientId.toString() === filterClient
      );
    }
    setFilteredProposals(filtered);
  }, [allProposals, filterClient]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center ">
      {/*---------------------------------------display client-------------------------------------------------*/}
      {activeProposalTab === "displayProposal" && (
        <div className="border rounded-lg shadow-md p-8 w-full mx-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Proposals{" "}
            <div className="flex items-center space-x-4">
              {/* -------------filter by email-------------------- */}
              <select
                value={filterClient}
                onChange={(e) => handleFilterChange("client", e.target.value)}
                className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Filter by client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    ({client.emailId}) {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => clearFilter()}
                className="mt-2 hover:bg-blue-400 bg-blue-100 text-black font-semibold py-2 px-4 rounded text-base"
              >
                clear filter
              </button>
              <button
                onClick={() => {
                  setActiveProposalTab("addProposal");
                }}
                className="mt-auto ml-19  hover:bg-green-400 text-black font-semibold py-2 px-4 rounded text-base"
                style={{ border: "1px solid black " }}
              >
                Add Proposal
              </button>
            </div>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Client</th>
                  <th className="py-2 px-4 border-b">Lead (id: description)</th>
                  <th className="py-2 px-4 border-b">Cost</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{proposal.id}</td>
                    <td className="py-2 px-4 border-b">
                      {proposal.firstName} {proposal.lastName} (
                      {proposal.emailId})
                    </td>
                    <td className="py-2 px-4 border-b">
                      {proposal.leadId}: {proposal.leadDescription}
                    </td>
                    <td className="py-2 px-4 border-b">{proposal.cost}</td>
                    <td className="py-2 px-4 border-b">{proposal.status}</td>
                    <td className="py-2 px-4 border-b">
                      {processing ? (
                        <button className="mt-6 bg-yellow-400  text-black font-semibold py-2 px-4 rounded">
                          wait...
                        </button>
                      ) : (
                        <span className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProposalId(proposal.id.toString());
                              setClientId(proposal.clientId.toString());
                              setLeadId(proposal.leadId.toString());
                              setStatus(proposal.status);
                              setCost(proposal.cost.toString());
                              setActiveProposalTab("updateProposal");
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

      {/*---------------------------------------Update proposal ---------------------------------------*/}
      {activeProposalTab === "updateProposal" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Update Proposal{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveProposalTab("displayProposal");
              }}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              cancel
            </button>
          </h2>

          <ToastContainer />

          <div>Proposal id: {selectedProposalId}</div>
          {/*----------------------Select Client Id-----------------------*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
              }}
            >
              {clients.map((client) => {
                return (
                  <option value={client.id} key={client.id}>
                    {client.emailId} {client.firstName} {client.lastName}
                  </option>
                );
              })}
            </select>
            {clientIdError && (
              <p className="text-red-500 text-sm">{clientIdError}</p>
            )}

            <div className="flex justify-between">
              {/*----------------------------Select Lead -----------------------*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Lead(id:description)
                </label>
                <select
                  value={leadId}
                  onChange={(e) => {
                    setLeadId(e.target.value);
                  }}
                >
                  {leads.map((lead) => {
                    return (
                      <option value={lead.id} key={lead.id}>
                        {lead.id}:{lead.description}
                      </option>
                    );
                  })}
                </select>
                {leadIdError && (
                  <p className="text-red-500 text-sm">{leadIdError}</p>
                )}
              </div>

              {/*----------------------Select Proposal Status-----------------------*/}
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
                {statusError && (
                  <p className="text-red-500 text-sm">{statusError}</p>
                )}
              </div>
            </div>

            {/* ----------------Cost--------------- */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Cost
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {costError && <p className="text-red-500 text-sm">{costError}</p>}
            </div>
          </div>
          <button
            disabled={processing}
            onClick={() => {
              updateProposal(
                selectedProposalId,
                clientId,
                leadId,
                cost,
                status
              );
            }}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
          >
            Update Proposal
          </button>
        </div>
      )}

      {/*----------------------------------------------------Add Client----------------------------------------------*/}
      {activeProposalTab === "addProposal" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Add proposal{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveProposalTab("displayProposal");
              }}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              cancel
            </button>
          </h2>
          <ToastContainer />
          {/*----------------------Select Client Id-----------------------*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
              }}
            >
              <option value="">select client</option>
              {clients.map((client) => {
                return (
                  <option value={client.id} key={client.id}>
                    {client.emailId} {client.firstName} {client.lastName}
                  </option>
                );
              })}
            </select>
            {clientIdError && (
              <p className="text-red-500 text-sm">{clientIdError}</p>
            )}

            <div className="flex justify-between">
              {/*----------------------------Select Lead -----------------------*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Lead
                </label>
                <select
                  value={leadId}
                  onChange={(e) => {
                    setLeadId(e.target.value);
                  }}
                >
                  <option value="">select Lead(id:description)</option>
                  {leads.map((lead) => {
                    return (
                      <option value={lead.id} key={lead.id}>
                        {lead.id}:{lead.description}
                      </option>
                    );
                  })}
                </select>
                {leadIdError && (
                  <p className="text-red-500 text-sm">{leadIdError}</p>
                )}
              </div>

              {/*----------------------Select Proposal Status-----------------------*/}
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
                  <option value="">select status</option>
                  <option value="New">New</option>
                  <option value="Discussion">Discussion</option>
                  <option value="Hold">Hold</option>
                  <option value="Hot">Hot</option>
                  <option value="Closed">Closed</option>
                </select>
                {statusError && (
                  <p className="text-red-500 text-sm">{statusError}</p>
                )}
              </div>
            </div>

            {/* ----------------Cost--------------- */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Cost
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {costError && <p className="text-red-500 text-sm">{costError}</p>}
            </div>
          </div>
          <button
            disabled={processing}
            onClick={() => {
              addProposal(clientId, leadId, cost, status);
            }}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
