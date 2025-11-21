"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.ok && data.user) {
        setAuthState({
          user: data.user,
          loading: false,
          isAuthenticated: true,
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("token");
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("token");
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
    window.location.href = "/";
  };

  return {
    ...authState,
    logout,
    refreshAuth: checkAuth,
  };
}






