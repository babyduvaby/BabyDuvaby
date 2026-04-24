import React from "react";
import Link from "next/link";

export default function AdminLoginPage({ onLogin, onLoginSuccess }) {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [errorCode, setErrorCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setErrorCode("");
    setIsSubmitting(true);

    const result = await onLogin(password);

    if (!result.success) {
      setError(result.message || "No se pudo iniciar sesion.");
      setErrorCode(result.code || "");
      setIsSubmitting(false);
      return;
    }

    onLoginSuccess?.();
  };

  return (
    <section className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-3 py-6 sm:max-w-xl sm:px-6 sm:py-8">
      <div className="glass-panel w-full rounded-3xl p-5 shadow-candy sm:p-8">
        {/* Logo / Brand indicator */}
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5f93d1] to-[#4e80bd] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#6c86a6]">
              Acceso Administrador
            </p>
          </div>
        </div>

        <h1 className="mt-2 font-title text-4xl leading-none text-ink sm:text-5xl">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm leading-relaxed font-semibold text-ink/85 sm:text-base">
          Ingresa la contrasena para editar el contenido de la landing.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-bold text-ink/85" htmlFor="admin-password">
            Contrasena
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contrasena"
              className="h-12 w-full rounded-2xl border border-[#d9e7ff] bg-white/95 pl-4 pr-14 text-base font-semibold text-ink outline-none transition focus:border-[#7ca2d9] focus:ring-4 focus:ring-[#dbe9ff] sm:text-sm"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#5f789b] transition hover:bg-[#edf4ff] active:bg-[#dce9ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcd4fb]"
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                  <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-1 2.2-2.65 4.06-4.73 5.31" />
                  <path d="M6.61 6.61C4.62 7.86 3 9.69 2 12c1.73 3.89 6 7 10 7 1.35 0 2.66-.24 3.88-.68" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error ? (
            <div className="rounded-xl border border-[#ffd3dd] bg-[#fff1f6] px-3 py-2.5 text-sm font-bold text-[#b03e66] sm:px-3 sm:py-2">
              <p>{error}</p>
              {errorCode ? (
                <p className="mt-1 text-xs font-semibold text-[#9f4562]">
                  Codigo: <span className="font-extrabold">{errorCode}</span>
                </p>
              ) : null}
            </div>
          ) : null}

          {errorCode === "auth/unauthorized-domain" ||
          errorCode === "auth/operation-not-allowed" ||
          errorCode === "auth/configuration-not-found" ||
          errorCode === "auth/invalid-api-key" ||
          errorCode === "auth/app-not-authorized" ? (
            <div className="rounded-xl border border-[#d6e6ff] bg-[#f2f7ff] px-3 py-2.5 text-xs font-semibold text-[#4f6e97]">
              Revisa Firebase Console: habilita Email/Password y autoriza este dominio en
              Authentication.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#5f93d1] to-[#4e80bd] px-5 text-base font-extrabold text-white shadow-lg shadow-[#5f93d1]/25 transition hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#cfe2ff] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-0 sm:h-12"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ingresando...
              </span>
            ) : (
              "Entrar al panel"
            )}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#607b9d] transition hover:text-[#4e6380] active:text-[#3d5070]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver al inicio
          </Link>
          <p className="text-[11px] font-semibold text-ink/40 sm:text-xs">
            PWA Instalable
          </p>
        </div>
      </div>
    </section>
  );
}
