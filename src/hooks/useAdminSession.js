import { useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { STORAGE_KEYS } from "../data/defaultContent";
import { firebaseAuth } from "../firebase";

const DEFAULT_ADMIN_EMAIL = "admin@babyduvaby.com";
const RAW_ADMIN_EMAILS =
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  process.env.REACT_APP_ADMIN_EMAILS ||
  process.env.REACT_APP_ADMIN_EMAIL ||
  DEFAULT_ADMIN_EMAIL;
const FALLBACK_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD_FALLBACK ||
  process.env.REACT_APP_ADMIN_PASSWORD_FALLBACK ||
  "";
const FALLBACK_ACTIVE_VALUE = "active";

function parseAdminEmails(rawEmails) {
  const uniqueEmails = new Set(
    String(rawEmails || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  );

  if (!uniqueEmails.size) {
    uniqueEmails.add(DEFAULT_ADMIN_EMAIL);
  }

  return [...uniqueEmails];
}

function readFallbackSession() {
  try {
    return localStorage.getItem(STORAGE_KEYS.adminFallbackSession) === FALLBACK_ACTIVE_VALUE;
  } catch {
    return false;
  }
}

function mapAuthError(error, currentEmail) {
  const code = error?.code || "unknown";

  if (code === "auth/unauthorized-domain") {
    return {
      code,
      message:
        "Dominio no autorizado en Firebase Auth. Agrega este dominio en Authentication > Settings > Authorized domains."
    };
  }

  if (code === "auth/operation-not-allowed" || code === "auth/configuration-not-found") {
    return {
      code,
      message:
        "Email/Password no esta habilitado en Firebase Auth. Activalo en Authentication > Sign-in method."
    };
  }

  if (code === "auth/invalid-api-key" || code === "auth/app-not-authorized") {
    return {
      code,
      message:
        "La configuracion Firebase del frontend no coincide con el proyecto. Verifica apiKey, authDomain y appId."
    };
  }

  if (code === "auth/network-request-failed") {
    return {
      code,
      message: "Error de red al contactar Firebase Auth. Intenta nuevamente."
    };
  }

  if (code === "auth/user-disabled") {
    return {
      code,
      message: `El usuario admin (${currentEmail}) esta deshabilitado en Firebase Auth.`
    };
  }

  if (code === "auth/too-many-requests") {
    return {
      code,
      message: "Demasiados intentos. Espera unos minutos e intenta otra vez."
    };
  }

  return {
    code,
    message: "No se pudo iniciar sesion. Verifica Firebase Auth."
  };
}

export function useAdminSession() {
  const [firebaseAuthenticated, setFirebaseAuthenticated] = useState(false);
  const [fallbackAuthenticated, setFallbackAuthenticated] = useState(readFallbackSession);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const adminEmails = useMemo(() => parseAdminEmails(RAW_ADMIN_EMAILS), []);
  const isAdminAuthenticated = firebaseAuthenticated || fallbackAuthenticated;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseAuthenticated(Boolean(user));
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithPassword = async (password) => {
    let hasCredentialError = false;
    let latestNonCredentialError = null;

    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
    } catch (error) {
      latestNonCredentialError = mapAuthError(error, adminEmails[0]);
    }

    for (const email of adminEmails) {
      try {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        localStorage.removeItem(STORAGE_KEYS.adminFallbackSession);
        setFallbackAuthenticated(false);
        return { success: true, mode: "firebase" };
      } catch (error) {
        const code = error?.code;
        const isCredentialIssue =
          code === "auth/user-not-found" ||
          code === "auth/wrong-password" ||
          code === "auth/invalid-credential";

        if (isCredentialIssue) {
          hasCredentialError = true;
          continue;
        }

        latestNonCredentialError = mapAuthError(error, email);
        break;
      }
    }

    if (latestNonCredentialError) {
      if (FALLBACK_PASSWORD && password === FALLBACK_PASSWORD) {
        localStorage.setItem(STORAGE_KEYS.adminFallbackSession, FALLBACK_ACTIVE_VALUE);
        setFallbackAuthenticated(true);
        return { success: true, mode: "fallback" };
      }

      return {
        success: false,
        message: latestNonCredentialError.message,
        code: latestNonCredentialError.code
      };
    }

    if (hasCredentialError) {
      return {
        success: false,
        message:
          "Contrasena incorrecta para el usuario admin configurado en Firebase Auth.",
        code: "auth/invalid-credential"
      };
    }

    return {
      success: false,
      message: "No se pudo iniciar sesion. Verifica Firebase Auth.",
      code: "auth/unknown"
    };
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEYS.adminFallbackSession);
    setFallbackAuthenticated(false);

    if (firebaseAuth.currentUser) {
      await signOut(firebaseAuth);
    }
  };

  return {
    isAdminAuthenticated,
    isAuthLoading,
    loginWithPassword,
    logout,
    adminEmails
  };
}
