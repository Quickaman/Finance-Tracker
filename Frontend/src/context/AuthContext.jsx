import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate auth state AFTER first render
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setHydrated(true);
  }, []);

  // Sync token to localStorage
  useEffect(() => {
    if (!hydrated) return;

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token, hydrated]);

  // Prevent rendering before auth is resolved
  if (!hydrated) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
