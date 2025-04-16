import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { getUsers } from '../services/userService';

// Types
interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Set token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        // If there's an error parsing the user data, clear the storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to use the real API endpoint
      try {
        const response = await api.post('/auth/login', { username, password });
        
        if (response.data && response.data.success) {
          const { token, user } = response.data;
          
          // Save to state
          setToken(token);
          setUser(user);
          setIsAuthenticated(true);
          
          // Save to local storage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Set token in axios headers for subsequent API calls
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          console.log('Successfully logged in with API:', user);
          return;
        }
      } catch (apiError) {
        console.log('API login failed, falling back to mock data');
        // If API call fails, fall back to the mock data
      }
      
      // Fallback to mock data for demo purposes
      const users = getUsers();
      const user = users.find(u => 
        (u.email === username || username === u.name.split(' ')[0].toLowerCase()) && 
        u.password === password
      );
      
      if (user) {
        // Create a user object that matches the expected format
        const authUser: User = {
          _id: user.id,
          username: user.name.split(' ')[0].toLowerCase(),
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ').slice(1).join(' '),
          email: user.email,
          role: user.role
        };
        
        // Generate a fake token
        const token = 'demo-token-' + Math.random().toString(36).substring(2);
        
        // Save to state
        setToken(token);
        setUser(authUser);
        setIsAuthenticated(true);
        
        // Save to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(authUser));
        
        // Set token in axios headers for subsequent API calls
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('Successfully logged in with mock data:', authUser);
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.isNetworkError) {
        setError(err.message);
      } else if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError(err.message || 'Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Remove token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        error,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 