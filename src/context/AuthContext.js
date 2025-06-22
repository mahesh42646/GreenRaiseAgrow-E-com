'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { profileAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Verify with backend
          try {
            const profile = await profileAPI.getUserProfile(userData.userId);
            setUser(profile);
          } catch (err) {
            // If API call fails, clear localStorage
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, this would be an API call to authenticate
      // For now, we'll simulate it with hardcoded values
      if (email && password) {
        const mockUser = {
          userId: 'user-123',
          name: 'John Doe',
          email: email,
          role: 'user',
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // In a real app, this would be an API call to register
      // For now, we'll simulate it with hardcoded values
      if (userData.email && userData.password) {
        const mockUser = {
          userId: 'user-' + Math.floor(Math.random() * 1000),
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: 'user',
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      if (!user) return false;
      
      // In a real app, this would be an API call to update profile
      // const updatedProfile = await profileAPI.updateUserProfile(user.userId, userData);
      
      // For now, we'll simulate it
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 