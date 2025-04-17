import { API_URL } from '@/lib/constant';
import { AuthContextType, User } from '@/types/auth';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.data.user);
        } else {
          toast.error(data.message || 'Failed to fetch user');
        }
      } catch (error) {
        setUser(null);
        toast.error('Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        toast.error(loginData.message || 'Login failed');
        throw new Error(loginData.message || 'Login failed');
      }

      const userResponse = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) {
        toast.error(userData.message || 'Failed to fetch user after login');
        throw new Error(userData.message || 'Failed to fetch user after login');
      }
      setUser(userData.data.user);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setUser(null);
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout failed', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};