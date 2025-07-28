'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../firebase-client';
import { profileAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    // Only run on client side and if auth is available
    if (typeof window === 'undefined' || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log('Creating backend user profile for Firebase user:', firebaseUser.uid);
          // Create or get backend user profile
          const backendUser = await profileAPI.createFirebaseUser(
            firebaseUser.uid,
            firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            firebaseUser.email,
            firebaseUser.phoneNumber || ''
          );
          console.log('Backend user created/retrieved:', backendUser);
          
          // Convert backend user to our app format
          const userData = {
            userId: backendUser.userId,
            name: backendUser.name,
            email: backendUser.email,
            phone: backendUser.phone || '',
            photoURL: firebaseUser.photoURL,
            role: backendUser.role,
            isEmailVerified: firebaseUser.emailVerified,
          };
          
          setUser(userData);
          
          // Store user data in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          console.error('Error creating backend user profile:', err);
          // Fallback to Firebase user data if backend fails
          const userData = {
            userId: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email,
            phone: firebaseUser.phoneNumber || '',
            photoURL: firebaseUser.photoURL,
            role: 'user',
            isEmailVerified: firebaseUser.emailVerified,
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      if (!auth) {
        setError('Authentication not available');
        return false;
      }
      const result = await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      if (!auth || !googleProvider) {
        setError('Authentication not available');
        return false;
      }
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create backend user profile for Google users
      try {
        await profileAPI.createFirebaseUser(
          result.user.uid,
          result.user.displayName || result.user.email?.split('@')[0] || 'User',
          result.user.email,
          result.user.phoneNumber || ''
        );
      } catch (backendErr) {
        console.error('Error creating backend user profile for Google user:', backendErr);
        // Continue even if backend creation fails
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      if (!auth) {
        setError('Authentication not available');
        return false;
      }
      const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // Update display name if provided
      if (result.user && (userData.firstName || userData.lastName)) {
        const displayName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        if (displayName) {
          await result.user.updateProfile({
            displayName: displayName
          });
        }
      }
      
      // Create backend user profile
      try {
        await profileAPI.createFirebaseUser(
          result.user.uid,
          displayName || userData.email?.split('@')[0] || 'User',
          userData.email,
          userData.phone || ''
        );
      } catch (backendErr) {
        console.error('Error creating backend user profile:', backendErr);
        // Continue even if backend creation fails
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (!auth) {
        setUser(null);
        localStorage.removeItem('user');
        return;
      }
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError(err.message);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      if (!user || !auth || !auth.currentUser) return false;
      
      // Update Firebase user profile
      await auth.currentUser.updateProfile({
        displayName: userData.name,
        phoneNumber: userData.phone
      });
      
      // Update local user state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      loginWithGoogle,
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 