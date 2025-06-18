"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClients } from "@/app/store/features/clients/clientService";
import { RootState, AppDispatch } from "@/app/store/store";
import { Client } from "@/types/Client";

import { DisplayClients } from "./DisplayClients";
import { EditClient } from "./EditClient";
import { AddClient } from "./AddClient";

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
        <AddClient
          setActiveClientTab={setActiveClientTab}
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
    </div>
  );
}
