import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  getCurrentUser,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(true);

  async function login(credentials) {
    const data = await loginUser(credentials);

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  }

  function logout() {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    async function restoreUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);

        setUser(data.user);
      } catch (error) {
        console.error("Failed to restore user:", error.message);

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}