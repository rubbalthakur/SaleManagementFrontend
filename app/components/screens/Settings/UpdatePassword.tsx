"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";

export function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

  const resetErrors = () => {
    setPasswordError("");
    setOldPasswordError("");
  };

  const validateFields = () => {
    let isValid = true;

    if (!oldPassword.trim()) {
      setOldPasswordError("Old Password is required");
      isValid = false;
    } else if (oldPassword.length < 6) {
      setOldPasswordError("Old Password is of more than 6 characters");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const updatePassword = async () => {
    resetErrors();
    let isValid = validateFields();

    if (isValid) {
      try {
        const response = await api.post(API_CONFIG.UPDATE_PASSWORD, {
          oldPassword,
          password,
        });
        console.log("Password updated successfully", response);
        toast.success("Password Updated");
        setOldPassword("");
        setPassword("");
      } catch (err) {
        console.error("Password Updation Failed", err);
        toast.error("Password Updation Failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border rounded-lg shadow-md p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
        <ToastContainer />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {oldPasswordError && (
            <p className="text-red-500 text-sm">{oldPasswordError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>

        <button
          onClick={updatePassword}
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded w-full"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
