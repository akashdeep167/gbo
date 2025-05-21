// context/UserContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState("");

  const checkTokenExpiration = useCallback(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        logout();
        return false;
      }
    }
    return true;
  }, [token]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);
      setUser(decodedToken.username);
      checkTokenExpiration();
    }
  }, [token, checkTokenExpiration]);

  const login = (newToken) => {
    setToken(newToken);
    const decodedToken = jwtDecode(newToken);
    setIsAdmin(decodedToken.isAdmin);
    setUser(decodedToken.username);
    localStorage.setItem("accessToken", newToken);
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);
    setUser("");
    localStorage.removeItem("accessToken");
  };

  return (
    <UserContext.Provider
      value={{ token, login, logout, isAdmin, user, checkTokenExpiration }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext and handle token expiration
export const useUser = () => {
  const context = React.useContext(UserContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  const { checkTokenExpiration, ...rest } = context;

  const checkTokenAndRedirect = useCallback(() => {
    if (!checkTokenExpiration()) {
      navigate("/");
    }
  }, [checkTokenExpiration, navigate]);

  return { ...rest, checkTokenAndRedirect };
};
