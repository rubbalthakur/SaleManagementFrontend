"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

interface ProfileResponse {
  message: string;
  userProfile: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    country: string;
    state: string;
    city: string;
  } | null;
}

export function Profile() {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  //----------------------------------------------reset error values------------------------------------
  const resetErrors = () => {
    setFirstNameError("");
    setLastNameError("");
    setContactNumberError("");
    setCountryError("");
    setStateError("");
    setCityError("");
  };

  //---------------------------------------validations-----------------------------------------
  const validateFields = () => {
    let isValid = true;

    if (!firstName.trim()) {
      setFirstNameError("First Name is required");
      isValid = false;
    }

    if (!lastName.trim()) {
      setLastNameError("Last Name is required");
      isValid = false;
    }

    if (!contactNumber.trim()) {
      setContactNumberError("Contact Number is required");
      isValid = false;
    } else if (!/^\d+$/.test(contactNumber)) {
      setContactNumberError("Contact Number must contain only digits");
      isValid = false;
    } else if (contactNumber.length < 10 || contactNumber.length > 15) {
      setContactNumberError("Contact Number must be between 10 and 15 digits");
      isValid = false;
    }

    if (!country.trim()) {
      setCountryError("Country is required");
      isValid = false;
    }

    if (!state.trim()) {
      setStateError("State is required");
      isValid = false;
    }

    if (!city.trim()) {
      setCityError("City is required");
      isValid = false;
    }

    return isValid;
  };

  //-----------------------------------update profile data------------------------------------------------
  const updateData = async () => {
    resetErrors();

    let isValid = true;
    isValid = validateFields();

    if (isValid) {
      try {
        const response = await api.post(API_CONFIG.UPDATE_PROFILE, {
          firstName,
          lastName,
          contactNumber,
          country,
          state,
          city,
        });
        console.log("Profile updated successfully", response);
        toast.success("Profile Updated");
      } catch (err) {
        console.error("Profile Updation Failed", err);
        toast.error("Profile Updation Failed");
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.post(API_CONFIG.GET_PROFILE, {});
        if (response.data.userProfile) {
          const profile = response.data.userProfile;
          setFirstName(profile.firstName || "");
          setLastName(profile.lastName || "");
          setContactNumber(profile.contactNumber || "");
          setCountry(profile.country || "");
          setState(profile.state || "");
          setCity(profile.city || "");
          setProfileData(response.data);
        }
      } catch (err) {
        console.log("error in fetching data", err);
      }
    };
    getData();
  }, []);

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 ">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
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
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {contactNumberError && (
              <p className="text-red-500 text-sm">{contactNumberError}</p>
            )}
          </div>
        </div>
        <button
          onClick={updateData}
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
