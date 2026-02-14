"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AdminPanelPage from "./AdminPanelPage";
import TopBar from "./TopBar";
import { useLandingConfig } from "../hooks/useLandingConfig";
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

export default function AdminPanelPageClient() {
  const router = useRouter();
  const {
    config,
    products,
    clickCount,
    clickAnalytics,
    syncMeta,
    isLoading,
    isSaving,
    error,
    saveContent,
    restoreDefaultContent,
    resetClickCount,
    importLandingSnapshot
  } = useLandingConfig();

  const { isAdminAuthenticated, isAuthLoading, logout } = useAdminSession();

  React.useEffect(() => {
    if (!isAuthLoading && !isAdminAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthLoading, isAdminAuthenticated, router]);

  if (isAuthLoading || !isAdminAuthenticated || isLoading) {
    return (
      <main className="app-shell min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fce9f2] via-[#f8f4fb] to-[#deebff] pb-8 text-ink">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="ambient ambient-top" />
          <div className="ambient ambient-bottom" />
        </div>
        <TopBar brand={config.brand} categories={config.categories} />
        <AdminAuthLoading />
      </main>
    );
  }

  return (
    <main className="app-shell min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fce9f2] via-[#f8f4fb] to-[#deebff] pb-8 text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="ambient ambient-top" />
        <div className="ambient ambient-bottom" />
      </div>

      <TopBar brand={config.brand} categories={config.categories} />

      {error ? (
        <div className="mx-auto mb-4 mt-3 max-w-3xl rounded-2xl border border-[#ffc6d9] bg-[#fff0f6] px-4 py-3 text-sm font-semibold text-[#b53d69]">
          {error}
        </div>
      ) : null}

      <AdminPanelPage
        config={config}
        products={products}
        clickCount={clickCount}
        clickAnalytics={clickAnalytics}
        syncMeta={syncMeta}
        isSaving={isSaving}
        onSaveContent={saveContent}
        onRestoreDefaultContent={restoreDefaultContent}
        onResetClickCount={resetClickCount}
        onImportSnapshot={importLandingSnapshot}
        onLogout={logout}
        onLoggedOut={() => router.replace("/admin/login")}
      />
    </main>
  );
}
