"use client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { setRoleId } from "../../../store/features/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

export function OrganisationProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [organisationName, setOrganisationName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const [organisationNameError, setOrganisationNameError] =
    useState<string>("");
  const [countryError, setCountryError] = useState<string>("");
  const [stateError, setStateError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");

  //----------------------------------------------reset error values------------------------------------
  const resetErrors = () => {
    setOrganisationNameError("");
    setCountryError("");
    setStateError("");
    setCityError("");
  };

  //---------------------------------------validations-----------------------------------------
  const validateFields = () => {
    let isValid = true;

    if (!organisationName.trim()) {
      setOrganisationNameError("Organisation Name is required");
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

  //--------------get user organisation--------------
  const getUserOrganisation = async () => {
    try {
      const response = await api.post(API_CONFIG.GET_USER_ORGANISATION);
      if (response?.data?.roleId) {
        dispatch(setRoleId(response.data.roleId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  //-----------------------------------Update Organisattion profile data------------------------------------------------
  const updateData = async () => {
    resetErrors();

    let isValid = true;
    isValid = validateFields();

    if (isValid) {
      try {
        const response = await api.post(
          API_CONFIG.UPDATE_ORGANISATION_PROFILE,
          {
            name: organisationName,
            country,
            state,
            city,
          }
        );
        if (response.status >= 200 && response.status < 300) {
          toast.success("Organisation Profile Updated");
          getUserOrganisation();
        } else {
          toast.error("Failed to update Organisation profile");
        }
      } catch (err) {
        console.error("Organisation Profile Updation Failed", err);
        toast.error("Organisation Profile Updation Failed");
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.post(
          API_CONFIG.GET_ORGANISATION_PROFILE,
          {}
        );
        if (response.data && Object.keys(response.data).length > 0) {
          const profile = response.data;
          setOrganisationName(profile.name || "");
          setCountry(profile.country || "");
          setState(profile.state || "");
          setCity(profile.city || "");
        }
      } catch (err) {
        console.log("error in fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
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
      <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4 ">
        <h2 className="text-2xl font-semibold mb-4">Organisation Profile</h2>
        <ToastContainer />
        <div className="grid grid-cols-2 gap-4">
          {/* Organisation Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Organisation
            </label>
            <input
              type="text"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {organisationNameError && (
              <p className="text-red-500 text-sm">{organisationNameError}</p>
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
