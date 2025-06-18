"use client";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchClients,
  updateClient,
} from "@/app/store/features/clients/clientService";
import { RootState, AppDispatch } from "@/app/store/store";

interface Props {
  setActiveClientTab: (
    tab: "displayClient" | "addClient" | "updateClient"
  ) => void;
  selectedClientId: number | null;
  firstName: string;
  setFirstName: (text: string) => void;
  lastName: string;
  setLastName: (text: string) => void;
  emailId: string;
  setEmailId: (text: string) => void;
  city: string;
  setCity: (text: string) => void;
  state: string;
  setState: (text: string) => void;
  country: string;
  setCountry: (text: string) => void;
  contact: string;
  setContact: (text: string) => void;
  firstNameError: string;
  lastNameError: string;
  emailIdError: string;
  cityError: string;
  stateError: string;
  countryError: string;
  contactError: string;
  isValid: () => boolean;
  resetVariables: () => void;
  resetError: () => void;
}
export function EditClient({
  setActiveClientTab,
  selectedClientId,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  emailId,
  setEmailId,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  contact,
  setContact,
  firstNameError,
  lastNameError,
  emailIdError,
  cityError,
  stateError,
  countryError,
  contactError,
  isValid,
  resetVariables,
  resetError,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const processing = useSelector(
    (state: RootState) => state.clients.processing
  );

  //---------------------------------------------handle update client function---------------------------------
  const handleUpdateClient = async () => {
    if (!isValid()) return;
    if (!selectedClientId) return;
    const resultAction = await dispatch(
      updateClient({
        id: selectedClientId,
        firstName,
        lastName,
        emailId,
        city,
        state,
        country,
        contact,
      })
    );
    if (updateClient.fulfilled.match(resultAction)) {
      toast.success("updated client");
      dispatch(fetchClients());
      setTimeout(() => {
        resetVariables();
        resetError();
        setActiveClientTab("displayClient");
      }, 600);
    } else if (updateClient.rejected.match(resultAction)) {
      toast.error("client not updated");
    }
  };

  return (
    <>
      {/*---------------------------------------Update clients ---------------------------------------*/}

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
            {stateError && <p className="text-red-500 text-sm">{stateError}</p>}
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
          disabled={processing}
          onClick={() => {
            handleUpdateClient();
          }}
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
        >
          Update Client
        </button>
      </div>
    </>
  );
}
