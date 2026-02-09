"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getUser, clearAuth } from "./_lib/auth";
import type { AuthUser } from "./_lib/types";
import { NovaLogo } from "../_components/shared/NovaLogo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    setUser(getUser());
    setChecking(false);
  }, [pathname, router]);

  function handleLogout() {
    clearAuth();
    router.push("/admin/login");
  }

  // Show nothing while checking auth (prevents flash)
  if (checking && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Login page doesn't need the admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <NovaLogo size="sm" />
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  Admin
                </span>
              </div>

              <nav className="flex items-center gap-1 overflow-x-auto">
                <NavLink href="/admin/onboarding" current={pathname.startsWith("/admin/onboarding")}>
                  Onboarding
                </NavLink>
                <NavLink href="/admin/audience" current={pathname.startsWith("/admin/audience")}>
                  Audience
                </NavLink>
                <NavLink href="/admin/market" current={pathname.startsWith("/admin/market")}>
                  Market
                </NavLink>
                <NavLink href="/admin/problems" current={pathname.startsWith("/admin/problems")}>
                  Problems
                </NavLink>
                <NavLink href="/admin/sessions" current={pathname.startsWith("/admin/sessions")}>
                  Voting
                </NavLink>
                <NavLink href="/admin/competitors" current={pathname.startsWith("/admin/competitors")}>
                  Competitors
                </NavLink>
                <NavLink href="/admin/projects" current={pathname.startsWith("/admin/projects")}>
                  Projects
                </NavLink>
                <NavLink href="/admin/solutions" current={pathname.startsWith("/admin/solutions")}>
                  Solutions
                </NavLink>
                <NavLink href="/admin/groups" current={pathname.startsWith("/admin/groups")}>
                  Groups
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        current
          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </Link>
  );
}
