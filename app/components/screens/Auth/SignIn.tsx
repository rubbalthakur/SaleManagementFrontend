"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/middleware/authMiddleware";
import { API_CONFIG } from "@/config/api";
interface SignInProps {
  onSignUpClick: () => void;
}
export function SignIn({ onSignUpClick }: SignInProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await api.post(API_CONFIG.SIGNIN_URL, {
      emailId: email,
      password,
    });
    console.log("Sign In successful", response.data?.token);
    localStorage.setItem("token", response.data?.token);

    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }

    // serverRedirect("/protected/dashboard")
  };

  return (
    <div className="login-container">
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
        <button type="submit">Sign In</button>
        <button onClick={onSignUpClick}>Sign Up</button>
      </form>
    </div>
  );
}
