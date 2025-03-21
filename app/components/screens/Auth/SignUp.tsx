"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface SignUpProps {
  onSignInClick: () => void;
}

type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function SignUp({ onSignInClick }: SignUpProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setError("Passwords do not match, Sign Up failed");
        return;
      }

      const response = await api.post(API_CONFIG.SIGNUP_URL, {
        emailId: email,
        password,
        confirmPassword,
      });
      console.log("Signup successful", response.data?.token);
      localStorage.setItem("token", response.data?.token);
      toast.success("Sign Up successful!");

      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Sign Up failed", err);
      const apiError = err as ApiErrorResponse;
      if (apiError.response?.data?.message) {
        setError(apiError.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error("Signup failed", err);
      toast.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  });

  return (
    <div className="login-container">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="">
        <svg
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#667eea"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
        <h2>Sign Up</h2>
        {error && <p>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign Up
        </button>
        <button
          onClick={onSignInClick}
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
