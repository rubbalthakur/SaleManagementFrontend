"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

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

export function Client() {
  const [activeClientTab, setActiveClientTab] = useState<
    "displayClient" | "addClient" | "updateClient"
  >("displayClient");

  const [allClients, setAllClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  const [filterClient, setFilterClient] = useState<string>("");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailIdError, setEmailIdError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [stateError, setStateError] = useState<string>("");
  const [countryError, setCountryError] = useState<string>("");
  const [contactError, setContactError] = useState<string>("");

  //-----------------------validations-----------------------------------
  const isValid = () => {
    if (!firstName) {
      setFirstNameError("First Name is required");
      return false;
    }
    if (!lastName) {
      setLastNameError("Last Name is required");
      return false;
    }
    if (!emailId) {
      setEmailIdError("Email is required");
      return false;
    }
    if (country.trim() === "") {
      setFirstNameError("country is required");
      return false;
    }
    if (state.trim() === "") {
      setStateError("state is required");
      return false;
    }
    if (!city) {
      setCityError("City is required");
      return false;
    }

    if (!contact.trim()) {
      setContactError("Contact Number is required");
      return false;
    } else if (!/^\d+$/.test(contact)) {
      setContactError("Contact Number must contain only digits");
      return false;
    } else if (contact.length < 10 || contact.length > 15) {
      setContactError("Contact Number must be between 10 and 15 digits");
      return false;
    }
    return true;
  };

  //--------------------------reset variables--------------------------
  const resetVariables = () => {
    setState("");
    setSelectedClientId("");
    setFirstName("");
    setLastName("");
    setEmailId("");
    setCity("");
    setCountry("");
    setContact("");
  };

  //-----------------------------reset error---------------------------------
  const resetError = () => {
    setFirstNameError("");
    setLastNameError("");
    setEmailIdError("");
    setCityError("");
    setStateError("");
    setCountryError("");
    setContactError("");
  };

  //---------------------------------get all clients-----------------------------------
  const getClients = async () => {
    try {
      setLoading(true);
      const response = await api.post(
        API_CONFIG.GET_ALL_CLIENT_BY_ORGANISATION
      );
      if (
        response.data?.OrganisationProfile?.Clients &&
        Object.keys(response.data.OrganisationProfile.Clients).length > 0
      ) {
        const leadData = response.data.OrganisationProfile.Clients.map(
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
        setAllClients(leadData);
        setFilteredClients(leadData);
      }
    } catch (error) {
      console.log("error in fetching clients", error);
    } finally {
      setLoading(false);
    }
  };

  //---------------------------------add new client-----------------------------------
  const addClient = async (
    firstName: string,
    lastName: string,
    emailId: string,
    city: string,
    state: string,
    country: string,
    contact: string
  ) => {
    try {
      if (!isValid()) return;

      setProcessing(true);
      const response = await api.post(API_CONFIG.ADD_CLIENT, {
        firstName,
        lastName,
        emailId,
        city,
        state,
        country,
        contact,
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
        setActiveClientTab("displayClient");
        getClients();
      }, 600);
    } catch (error) {
      console.log("error in adding client", error);
      toast.error("error in adding client");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //---------------------------------------------update client---------------------------------
  const updateClient = async (
    selectedClientId: string,
    firstName: string,
    lastName: string,
    emailId: string,
    city: string,
    state: string,
    country: string,
    contact: string
  ) => {
    try {
      if (!isValid()) return;
      setProcessing(true);
      const response = await api.post(API_CONFIG.UPDATE_LEAD, {
        id: parseInt(selectedClientId),
        firstName,
        lastName,
        emailId,
        city,
        state,
        country,
        contact,
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
        setActiveClientTab("displayClient");
        getClients();
      }, 600);
    } catch (error) {
      console.log("error in updating client", error);
      toast.error("client not updated");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "email") {
      setFilterClient(value);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    let filtered = [...allClients];
    if (filterClient) {
      filtered = filtered.filter(
        (client) => client.id.toString() === filterClient
      );
    }
    setFilteredClients(filtered);
  }, [allClients, filterClient]);

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
      {activeClientTab === "displayClient" && (
        <div className="border rounded-lg shadow-md p-8 w-full mx-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Clients{" "}
            <div className="flex items-center space-x-4">
              {/* -------------filter by email-------------------- */}
              <select
                value={filterClient}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                className="mt-2 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Filter by email</option>
                {allClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.emailId}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setActiveClientTab("addClient");
                }}
                className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
                style={{ border: "1px solid black " }}
              >
                Add Client
              </button>
            </div>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">City</th>
                  <th className="py-2 px-4 border-b">State</th>
                  <th className="py-2 px-4 border-b">Country</th>
                  <th className="py-2 px-4 border-b">ContactNumber</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{client.id}</td>
                    <td className="py-2 px-4 border-b">{client.emailId}</td>
                    <td className="py-2 px-4 border-b">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="py-2 px-4 border-b">{client.city}</td>
                    <td className="py-2 px-4 border-b">{client.state}</td>
                    <td className="py-2 px-4 border-b">{client.country}</td>
                    <td className="py-2 px-4 border-b">{client.contact}</td>
                    <td className="py-2 px-4 border-b">
                      {processing ? (
                        <button className="mt-6 bg-yellow-400  text-black font-semibold py-2 px-4 rounded">
                          wait...
                        </button>
                      ) : (
                        <span className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedClientId(client.id.toString());
                              setFirstName(client.firstName);
                              setLastName(client.lastName);
                              setEmailId(client.emailId);
                              setCountry(client.country);
                              setState(client.state);
                              setCity(client.city);
                              setContact(client.contact);
                              setActiveClientTab("updateClient");
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

      {/*---------------------------------------Update clients ---------------------------------------*/}
      {activeClientTab === "updateClient" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Update Client{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveClientTab("displayClient");
              }}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              cancel
            </button>
          </h2>

          <ToastContainer />
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {firstNameError && (
                <p className="text-red-500 text-sm">{firstNameError}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {lastNameError && (
                <p className="text-red-500 text-sm">{lastNameError}</p>
              )}
            </div>

            {/* EmailId */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {emailIdError && (
                <p className="text-red-500 text-sm">{emailIdError}</p>
              )}
            </div>

            {/* Country */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {countryError && (
                <p className="text-red-500 text-sm">{countryError}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {stateError && (
                <p className="text-red-500 text-sm">{stateError}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {cityError && <p className="text-red-500 text-sm">{cityError}</p>}
            </div>

            {/* Contact Number */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {contactError && (
                <p className="text-red-500 text-sm">{contactError}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              updateClient(
                selectedClientId,
                firstName,
                lastName,
                emailId,
                city,
                state,
                country,
                contact
              );
            }}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
          >
            Update Client
          </button>
        </div>
      )}

      {/*----------------------------------------------------Add Client----------------------------------------------*/}
      {activeClientTab === "addClient" && (
        <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 my-4">
          <h2 className="text-2xl font-semibold mb-4">
            {" "}
            Add clients{" "}
            <button
              onClick={() => {
                resetVariables();
                resetError();
                setActiveClientTab("displayClient");
              }}
              className="mt-6 ml-19  hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded text-base"
              style={{ border: "1px solid black " }}
            >
              cancel
            </button>
          </h2>
          <ToastContainer />
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {firstNameError && (
                <p className="text-red-500 text-sm">{firstNameError}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {lastNameError && (
                <p className="text-red-500 text-sm">{lastNameError}</p>
              )}
            </div>

            {/* EmailId */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {emailIdError && (
                <p className="text-red-500 text-sm">{emailIdError}</p>
              )}
            </div>
            {/* Country */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {countryError && (
                <p className="text-red-500 text-sm">{countryError}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {stateError && (
                <p className="text-red-500 text-sm">{stateError}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {cityError && <p className="text-red-500 text-sm">{cityError}</p>}
            </div>

            {/* Contact Number */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {contactError && (
                <p className="text-red-500 text-sm">{contactError}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              addClient(
                firstName,
                lastName,
                emailId,
                city,
                state,
                country,
                contact
              );
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
