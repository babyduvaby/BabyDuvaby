import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await onLogin(password);

    if (!result.success) {
      setError(result.message || "No se pudo iniciar sesion.");
      setIsSubmitting(false);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center px-4 py-8 sm:px-6">
      <div className="glass-panel w-full rounded-3xl p-6 shadow-candy sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#6c86a6]">
          Acceso Administrador
        </p>
        <h1 className="mt-2 font-title text-5xl leading-none text-ink sm:text-6xl">
          Iniciar sesion
        </h1>
        <p className="mt-3 text-sm font-semibold text-ink/85">
          Ingresa la contrasena para editar el contenido de la landing.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-bold text-ink/85" htmlFor="admin-password">
            Contrasena
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contrasena"
            className="h-12 w-full rounded-2xl border border-[#d9e7ff] bg-white/95 px-4 text-sm font-semibold text-ink outline-none transition focus:border-[#7ca2d9] focus:ring-4 focus:ring-[#dbe9ff]"
            autoComplete="current-password"
            required
          />

          {error ? (
            <p className="rounded-xl border border-[#ffd3dd] bg-[#fff1f6] px-3 py-2 text-sm font-bold text-[#b03e66]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#5f93d1] to-[#4e80bd] px-5 text-base font-extrabold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#cfe2ff]"
          >
            {isSubmitting ? "Ingresando..." : "Entrar al panel"}
          </button>
        </form>

        <Link
          to="/"
          className="mt-4 inline-flex text-sm font-bold text-[#607b9d] transition hover:text-[#4e6380]"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
