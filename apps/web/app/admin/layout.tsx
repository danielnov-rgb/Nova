"use client";

import { useEffect, useState, useRef } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

  // Check if any "more" menu item is active
  const moreMenuPaths = [
    "/admin/onboarding",
    "/admin/audience",
    "/admin/market",
    "/admin/competitors",
    "/admin/projects",
    "/admin/solutions",
    "/admin/features",
    "/admin/plugin",
    "/admin/plugin/demo",
    "/admin/analytics",
    "/admin/groups",
    "/admin/sprints",
    "/admin/import",
  ];
  const isMoreMenuActive = moreMenuPaths.some(path => pathname.startsWith(path));

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

              {/* Main Navigation - Only Problems & Voting */}
              <nav className="flex items-center gap-1">
                <NavLink href="/admin/problems" current={pathname.startsWith("/admin/problems")}>
                  Problems
                </NavLink>
                <NavLink href="/admin/sessions" current={pathname.startsWith("/admin/sessions")}>
                  Voting
                </NavLink>
              </nav>
            </div>

            {/* Right side - User menu dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMoreMenuActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {user?.email && (
                  <span className="hidden sm:inline max-w-32 truncate">{user.email}</span>
                )}
                <svg
                  className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Research & Intel
                    </p>
                  </div>
                  <DropdownLink href="/admin/onboarding" current={pathname.startsWith("/admin/onboarding")}>
                    Onboarding
                  </DropdownLink>
                  <DropdownLink href="/admin/audience" current={pathname.startsWith("/admin/audience")}>
                    Audience
                  </DropdownLink>
                  <DropdownLink href="/admin/market" current={pathname.startsWith("/admin/market")}>
                    Market Intel
                  </DropdownLink>
                  <DropdownLink href="/admin/competitors" current={pathname.startsWith("/admin/competitors")}>
                    Competitors
                  </DropdownLink>

                  <div className="px-3 py-2 border-b border-t border-gray-100 dark:border-gray-800 mt-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </p>
                  </div>
                  <DropdownLink href="/admin/projects" current={pathname.startsWith("/admin/projects")}>
                    Projects
                  </DropdownLink>
                  <DropdownLink href="/admin/solutions" current={pathname.startsWith("/admin/solutions")}>
                    Solutions
                  </DropdownLink>
                  <DropdownLink href="/admin/sprints" current={pathname.startsWith("/admin/sprints")}>
                    Sprints
                  </DropdownLink>

                  <div className="px-3 py-2 border-b border-t border-gray-100 dark:border-gray-800 mt-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Plugin & Analytics
                    </p>
                  </div>
                  <DropdownLink href="/admin/features" current={pathname.startsWith("/admin/features")}>
                    Features
                  </DropdownLink>
                  <DropdownLink href="/admin/plugin" current={pathname === "/admin/plugin"}>
                    Plugin
                  </DropdownLink>
                  <DropdownLink href="/admin/plugin/demo" current={pathname.startsWith("/admin/plugin/demo")}>
                    Plugin Demo
                  </DropdownLink>
                  <DropdownLink href="/admin/analytics" current={pathname.startsWith("/admin/analytics")}>
                    Analytics
                  </DropdownLink>

                  <div className="px-3 py-2 border-b border-t border-gray-100 dark:border-gray-800 mt-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Settings
                    </p>
                  </div>
                  <DropdownLink href="/admin/groups" current={pathname.startsWith("/admin/groups")}>
                    Voter Groups
                  </DropdownLink>
                  <DropdownLink href="/admin/import" current={pathname.startsWith("/admin/import")}>
                    Import Data
                  </DropdownLink>

                  <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
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

function DropdownLink({
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
      className={`block px-3 py-2 text-sm transition-colors ${
        current
          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </Link>
  );
}
