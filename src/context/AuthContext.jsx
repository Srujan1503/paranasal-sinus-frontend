// Provides authentication state and shared auth helpers to the app.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return signInWithPopup(auth, googleProvider);
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName && credentials?.user) {
      await updateProfile(credentials.user, { displayName });
    }

    return credentials;
  }, []);

  const logout = useCallback(async () => {
    return signOut(auth);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return sendPasswordResetEmail(auth, email);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginWithGoogle,
      signup,
      logout,
      forgotPassword,
    }),
    [user, loading, login, loginWithGoogle, signup, logout, forgotPassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
