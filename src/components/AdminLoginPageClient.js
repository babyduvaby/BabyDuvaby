"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdminLoginPage from "./AdminLoginPage";
import TopBar from "./TopBar";
import { defaultLandingConfig } from "../data/defaultContent";
import { useAdminSession } from "../hooks/useAdminSession";

function AdminAuthLoading() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center px-4 py-8 sm:px-6">
      <div className="glass-panel w-full animate-pulse rounded-3xl p-6 shadow-candy sm:p-8">
        <div className="h-4 w-32 rounded bg-[#e1ecff]" />
        <div className="mt-3 h-8 w-56 rounded bg-[#e1ecff]" />
        <div className="mt-6 h-12 w-full rounded-xl bg-[#e1ecff]" />
      </div>
    </section>
  );
}

export default function AdminLoginPageClient() {
  const router = useRouter();
  const { isAdminAuthenticated, isAuthLoading, loginWithPassword } = useAdminSession();

  React.useEffect(() => {
    if (!isAuthLoading && isAdminAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthLoading, isAdminAuthenticated, router]);

  return (
    <main className="app-shell min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fce9f2] via-[#f8f4fb] to-[#deebff] pb-8 text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-bottom" />
      </div>

      <TopBar brand={defaultLandingConfig.brand} />

      {isAuthLoading || isAdminAuthenticated ? (
        <AdminAuthLoading />
      ) : (
        <AdminLoginPage
          onLogin={loginWithPassword}
          onLoginSuccess={() => router.replace("/admin")}
        />
      )}
    </main>
  );
}

