'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthAPI } from '../services/adminApi';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if admin is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const adminUser = adminAuthAPI.checkAuth();
        setAdmin(adminUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const adminData = await adminAuthAPI.login(credentials);
      setAdmin(adminData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    adminAuthAPI.logout();
    setAdmin(null);
    router.push('/admin');
  };

  return (
    <AdminContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
} 