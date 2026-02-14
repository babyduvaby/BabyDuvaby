import { useEffect, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { firebaseAuth } from "../firebase";

const DEFAULT_ADMIN_EMAIL = "admin@babyduvaby.com";
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;

export function useAdminSession() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setIsAdminAuthenticated(Boolean(user));
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithPassword = async (password) => {
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithEmailAndPassword(firebaseAuth, ADMIN_EMAIL, password);
      return { success: true };
    } catch (error) {
      if (error?.code === "auth/user-not-found") {
        return {
          success: false,
          message: "El usuario admin no existe en Firebase Auth."
        };
      }

      if (error?.code === "auth/invalid-credential") {
        return { success: false, message: "Contrasena incorrecta." };
      }

      if (error?.code === "auth/too-many-requests") {
        return {
          success: false,
          message: "Demasiados intentos. Espera unos minutos e intenta otra vez."
        };
      }

      return {
        success: false,
        message: "No se pudo iniciar sesion. Verifica Firebase Auth."
      };
    }
  };

  const logout = async () => {
    await signOut(firebaseAuth);
  };

  return {
    isAdminAuthenticated,
    isAuthLoading,
    loginWithPassword,
    logout
  };
}
