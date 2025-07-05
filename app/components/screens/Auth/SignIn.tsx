"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface SignInProps {
  onSignUpClick: () => void;
}
type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};
export function SignIn({ onSignUpClick }: SignInProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post(API_CONFIG.SIGNIN_URL, {
        emailId: email,
        password,
      });

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("token", response.data?.token);
        toast.success("Signin successful!");

        const token = localStorage.getItem("token");
        if (token) {
          router.push("/dashboard");
        }
      } else {
        toast.error("Signin Failed");
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      if (apiError.response?.data?.message) {
        setError(apiError.response.data.message);
      } else {
        setError("SignIn failed. Please try again.");
      }
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.post(API_CONFIG.TEST_SIGNIN_URL, {});

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("token", response.data?.token);
        toast.success("Signin successful!");

        const token = localStorage.getItem("token");
        if (token) {
          router.push("/dashboard");
        }
      } else {
        toast.error("Signin Failed");
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      if (apiError.response?.data?.message) {
        setError(apiError.response.data.message);
      } else {
        setError("SignIn failed. Please try again.");
      }
      toast.error(error);
    } finally {
      setLoading(false);
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
      <form onSubmit={handleSubmit}>
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
        <h2>Sign In</h2>
        {error && <p className="error">{error}</p>}
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
        <button type="submit" disabled={loading}>
          Sign In
        </button>
        <button onClick={handleTestSignIn} disabled={loading}>
          Sign In Without Credientials
        </button>
        <button onClick={onSignUpClick} disabled={loading}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
