"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext: any = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      // Simulate checking if the token is valid (you can also validate it with an API call)
      setUser(JSON.parse(storedUser)); // Restore user from localStorage
    } else {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]); // Ensures the effect runs when the router changes

  const login = async (credentials: any) => {
    const { email, Password } = credentials;

    // Hardcoded credentials for testing (replace with your real authentication logic)
    if (
      email === "admin@gmail.com" &&
      Password === "Hisabr@123"
    ) {
      const mockUser = { id: 1, name: "John Doe", email };

      // Store token and user data in localStorage
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("user", JSON.stringify(mockUser));

      setUser(mockUser); // Set the user in state
      router.push("/"); // Redirect to the home page
    } else {
      alert("Invalid email or password");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // Clear the user state
    router.push("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
