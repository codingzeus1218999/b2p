"use client";
import { ENDPOINT_URLS } from "@/constants";
import { AuthContextType, DecodedToken } from "@/interfaces";
import { authRoute, privateRoutes } from "@/routes/routes";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  refreshAccessToken: async () => {},
  getDecodedToken: () => null,
  setIsLoggedIn: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (typeof window === "undefined") return;

      const access = window.sessionStorage.getItem("access");
      const refresh = window.sessionStorage.getItem("refresh");

      if (
        !access ||
        !refresh ||
        access === "undefined" ||
        refresh === "undefined"
      ) {
        if (privateRoutes.includes(router.pathname)) {
          router.push("/login?tab=login");
        }
        setLoading(false);
        return;
      }

      if (authRoute.some((e: string) => router.pathname.includes(e))) {
        router.push("/");
      }

      const decodedToken: DecodedToken | null = access
        ? jwtDecode<DecodedToken>(access)
        : null;
      const currentTime = Date.now() / 1000;

      if (!decodedToken || decodedToken.exp < currentTime) {
        try {
          const response = await axios.post(
            `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.REFRESH}`,
            { refresh }
          );
          const { access: newAccessToken } = response.data;
          window.sessionStorage.setItem("access", newAccessToken);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error refreshing access token:", error);
          logout();
        }
      } else {
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    checkAndRefreshToken();
  }, [router.pathname]);

  const login = (access: string, refresh: string) => {
    window.sessionStorage.setItem("access", access);
    window.sessionStorage.setItem("refresh", refresh);
    setIsLoggedIn(true);
  };

  const logout = () => {
    window.sessionStorage.removeItem("access");
    window.sessionStorage.removeItem("refresh");
    setIsLoggedIn(false);
    router.push("/login?tab=login");
  };

  const refreshAccessToken = async () => {
    if (typeof window === "undefined") return;
    const access = window.sessionStorage.getItem("access");
    const refresh = window.sessionStorage.getItem("refresh");
    try {
      const response = await axios.post(
        `${ENDPOINT_URLS.BASE_URL}${ENDPOINT_URLS.REFRESH}`,
        { refresh }
      );
      const { access: newAccessToken } = response.data;
      window.sessionStorage.setItem("access", newAccessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      logout();
    }
  };

  const getDecodedToken = () => {
    if (typeof window === "undefined") return null;
    const access = window.sessionStorage.getItem("access");
    return access ? jwtDecode<DecodedToken>(access) : null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        refreshAccessToken,
        getDecodedToken,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
