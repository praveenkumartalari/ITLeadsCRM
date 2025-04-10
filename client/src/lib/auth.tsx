import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "./queryClient";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSalesRep: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  
  // Check for existing token on app initialization
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
      if (!location.includes("/login") && !location.includes("/register")) {
        navigate("/login");
      }
    }
  }, []);
  
  // Fetch current user data when token is available
  const fetchCurrentUser = async (currentToken: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Session expired");
      }
      
      const data = await res.json();
      setUser(data.user);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setError("Session expired. Please login again.");
      setIsLoading(false);
      navigate("/login");
    }
  };
  
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await apiRequest("POST", "/api/auth/login", { username, password });
      const data = await res.json();
      
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to login");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (username: string, email: string, password: string, role: string = "sales_rep") => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await apiRequest("POST", "/api/auth/register", { username, email, password, role });
      const data = await res.json();
      
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to register");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };
  
  // Derived state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isSalesRep = user?.role === "sales_rep";
  
  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isManager,
    isSalesRep
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
