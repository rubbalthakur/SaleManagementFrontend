"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { fetchClients } from "@/app/store/features/clients/clientService";
import { RootState, AppDispatch } from "@/app/store/store";
import { Client } from "@/types/Client";

import { DisplayClients } from "./DisplayClients";
import { EditClient } from "./EditClient";

import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

export function Clients() {
  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector((state: RootState) => state.clients.error);

  const [activeClientTab, setActiveClientTab] = useState<
    "displayClient" | "addClient" | "updateClient"
  >("displayClient");

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

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
    setSelectedClientId(null);
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
        dispatch(fetchClients());
      }, 600);
    } catch (error) {
      console.log("error in adding client", error);
      toast.error("error in adding client");
      setTimeout(() => {
        setProcessing(false);
      }, 600);
    }
  };

  //---------------props functions for display clients--------------
  const onEditClick = (client: Client) => {
    setSelectedClientId(client.id);
    setFirstName(client.firstName);
    setLastName(client.lastName);
    setEmailId(client.emailId);
    setCountry(client.country);
    setState(client.state);
    setCity(client.city);
    setContact(client.contact);
    setActiveClientTab("updateClient");
  };

  const onAddClick = () => {
    setActiveClientTab("addClient");
  };

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error in loadig clients
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center ">
      {/*---------------------------------------display client-------------------------------------------------*/}
      {activeClientTab === "displayClient" && (
        <DisplayClients onAddClick={onAddClick} onEditClick={onEditClick} />
      )}

      {/*---------------------------------------Update clients ---------------------------------------*/}
      {activeClientTab === "updateClient" && (
        <EditClient
          setActiveClientTab={setActiveClientTab}
          selectedClientId={selectedClientId}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          emailId={emailId}
          setEmailId={setEmailId}
          city={city}
          setCity={setCity}
          state={state}
          setState={setState}
          country={country}
          setCountry={setCountry}
          contact={contact}
          setContact={setContact}
          firstNameError={firstNameError}
          lastNameError={lastNameError}
          emailIdError={emailIdError}
          cityError={cityError}
          stateError={stateError}
          countryError={countryError}
          contactError={contactError}
          isValid={isValid}
          resetVariables={resetVariables}
          resetError={resetError}
        />
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
