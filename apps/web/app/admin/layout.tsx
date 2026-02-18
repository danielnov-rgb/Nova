"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, getUser, clearAuth, setAuth } from "./_lib/auth";
import type { AuthUser, LoginResponse } from "./_lib/types";
import { NovaLogo } from "../_components/shared/NovaLogo";
import { DemoModePopup, useDemoModePopup } from "./_components/DemoModePopup";
import { isDemoModeError, DemoModeError, isReadOnly, canManageProblems, canManageSessions, canAccessAdminSessions, shouldUseVoterInterface } from "./_lib/permissions";
import { authApi } from "./_lib/api";
import { AstraChatPanel, AstraChatToggle, useAstraChat, useAstraContext } from "./_components/astra";

// Demo users for quick switching during testing
// Groups marked as "Full Access" can manage sessions, others use voter interface
const DEMO_USERS = {
  "FDE Team": [
    { name: "FDE Admin", email: "fde@novademo.com" },
  ],
  "Product Team": [
    { name: "Daniel", email: "daniel@novademo.com" },
    { name: "Jacques", email: "jacques@novademo.com" },
    { name: "Ray", email: "ray@novademo.com" },
  ],
  "Leadership": [
    { name: "Steven", email: "steven@novademo.com" },
    { name: "Marcel", email: "marcel@novademo.com" },
  ],
  "Team Members": [
    { name: "Meagan", email: "meagan@novademo.com" },
    { name: "Matt", email: "matt@novademo.com" },
  ],
  "Clients": [
    { name: "Werner", email: "werner@novademo.com" },
    { name: "Isak", email: "isak@novademo.com" },
  ],
};

// Groups with full admin access
const FULL_ACCESS_GROUPS = ["FDE Team", "Product Team"];

// Context for permission checks
interface AdminContextType {
  user: AuthUser | null;
  isReadOnly: boolean;
  canManageProblems: boolean;
  canManageSessions: boolean;
  isDemoMode: boolean;
  showDemoError: (error: DemoModeError) => void;
  handleApiError: (error: unknown) => boolean; // Returns true if it was a demo mode error
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdminContext() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminContext must be used within AdminLayout");
  }
  return ctx;
}

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
  const [userSwitcherOpen, setUserSwitcherOpen] = useState(false);
  const [switchingUser, setSwitchingUser] = useState(false);
  const [astraOpen, setAstraOpen] = useState(false);
  const astraContext = useAstraContext();
  const { messages: astraMessages, isStreaming: astraStreaming, sendMessage: astraSendMessage, clearChat: astraClearChat } = useAstraChat(astraContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const userSwitcherRef = useRef<HTMLDivElement>(null);
  const { error: demoError, showDemoError, clearError } = useDemoModePopup();

  // Switch to a different demo user
  async function handleSwitchUser(email: string) {
    setSwitchingUser(true);
    try {
      const response = await authApi.login(email, "demo123");
      clearAuth();
      setAuth(response);
      setUser(response.user);
      setUserSwitcherOpen(false);

      // Check if we need to redirect based on new user's permissions
      const isOnSessionsRoute = pathname.startsWith("/admin/sessions");
      const newUserShouldUseVoter = shouldUseVoterInterface(response.user);

      if (isOnSessionsRoute && newUserShouldUseVoter) {
        // Redirect to voter dashboard if new user can't access admin sessions
        window.location.href = "/voter/dashboard";
      } else {
        // Refresh the page to reload data with new user
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to switch user:", err);
      alert("Failed to switch user. Please try again.");
    } finally {
      setSwitchingUser(false);
    }
  }

  // Handle API errors and show demo mode popup if applicable
  const handleApiError = useCallback((error: unknown): boolean => {
    if (isDemoModeError(error)) {
      showDemoError(error);
      return true;
    }
    return false;
  }, [showDemoError]);

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

    const currentUser = getUser();
    setUser(currentUser);

    // Role-based route protection for sessions
    const isSessionsRoute = pathname.startsWith("/admin/sessions");
    if (isSessionsRoute && shouldUseVoterInterface(currentUser)) {
      // Redirect non-admin users to voter dashboard
      router.push("/voter/dashboard");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (userSwitcherRef.current && !userSwitcherRef.current.contains(event.target as Node)) {
        setUserSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserSwitcherOpen(false);
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
    "/admin/strategy",
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
    "/astrolytics",
  ];
  const isMoreMenuActive = moreMenuPaths.some(path => pathname.startsWith(path));

  // Build context value
  const contextValue: AdminContextType = {
    user,
    isReadOnly: isReadOnly(user),
    canManageProblems: canManageProblems(user),
    canManageSessions: canManageSessions(user),
    isDemoMode: user?.isDemoMode ?? false,
    showDemoError,
    handleApiError,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Demo Mode Popup */}
        <DemoModePopup error={demoError} onClose={clearError} />

        {/* Demo Mode Banner */}
        {user?.isDemoMode && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">Demo Mode</span>
              <span className="text-purple-200">— You're exploring Nova. Changes won't be saved.</span>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <NovaLogo size="sm" />
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                  Admin
                </span>
              </div>

              {/* Main Navigation - Role-based */}
              <nav className="flex items-center gap-1">
                <NavLink href="/admin/dashboard" current={pathname === "/admin/dashboard"}>
                  Dashboard
                </NavLink>
                <NavLink href="/admin/problems" current={pathname.startsWith("/admin/problems")}>
                  Discovery
                </NavLink>
                {canAccessAdminSessions(user) && (
                  <NavLink href="/admin/sessions" current={pathname.startsWith("/admin/sessions")}>
                    Voting
                  </NavLink>
                )}
                {shouldUseVoterInterface(user) && (
                  <NavLink href="/voter/dashboard" current={pathname.startsWith("/voter")}>
                    My Votes
                  </NavLink>
                )}
              </nav>
            </div>

            {/* Right side - User switcher + Menu dropdown */}
            <div className="flex items-center gap-2">
              {/* User Switcher for Testing */}
              <div className="relative" ref={userSwitcherRef}>
                <button
                  onClick={() => setUserSwitcherOpen(!userSwitcherOpen)}
                  disabled={switchingUser}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {switchingUser ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  <span className="hidden sm:inline max-w-24 truncate">
                    {user?.firstName || user?.email?.split("@")[0] || "User"}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${userSwitcherOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Switcher Dropdown */}
                {userSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 max-h-96 overflow-y-auto">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Switch User (Testing)
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Current: {user?.email}
                      </p>
                    </div>
                    {Object.entries(DEMO_USERS).map(([group, users]) => {
                      const hasFullAccess = FULL_ACCESS_GROUPS.includes(group);
                      return (
                      <div key={group}>
                        <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {group}
                          </p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            hasFullAccess
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}>
                            {hasFullAccess ? "Full Access" : "Voter"}
                          </span>
                        </div>
                        {users.map((demoUser) => (
                          <button
                            key={demoUser.email}
                            onClick={() => handleSwitchUser(demoUser.email)}
                            disabled={switchingUser || user?.email === demoUser.email}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                              user?.email === demoUser.email
                                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            } disabled:opacity-50`}
                          >
                            <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                              {demoUser.name.charAt(0)}
                            </span>
                            <span>{demoUser.name}</span>
                            {user?.email === demoUser.email && (
                              <svg className="w-4 h-4 ml-auto text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    );
                    })}
                  </div>
                )}
              </div>

              {/* Menu dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isMoreMenuActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-medium text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                      01 — Strategy Agent
                    </p>
                  </div>
                  <DropdownLink href="/admin/onboarding" current={pathname.startsWith("/admin/onboarding") || pathname.startsWith("/admin/strategy")}>
                    Business Context
                  </DropdownLink>

                  <div className="px-3 py-2 border-b border-t border-gray-100 dark:border-gray-800 mt-1">
                    <p className="text-xs font-medium text-purple-500 dark:text-purple-400 uppercase tracking-wider">
                      02 — Research Agent
                    </p>
                  </div>
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
                    <p className="text-xs font-medium text-cyan-500 dark:text-cyan-400 uppercase tracking-wider">
                      04 — Solution Architecture
                    </p>
                  </div>
                  <DropdownLink href="/admin/solutions" current={pathname.startsWith("/admin/solutions")}>
                    Solutions
                  </DropdownLink>

                  <div className="px-3 py-2 border-b border-t border-gray-100 dark:border-gray-800 mt-1">
                    <p className="text-xs font-medium text-green-500 dark:text-green-400 uppercase tracking-wider">
                      05 — Engineering Agents
                    </p>
                  </div>
                  <DropdownLink href="/admin/projects" current={pathname.startsWith("/admin/projects")}>
                    Projects
                  </DropdownLink>
                  <DropdownLink href="/admin/features" current={pathname.startsWith("/admin/features")}>
                    Features
                  </DropdownLink>
                  <DropdownLink href="/admin/sprints" current={pathname.startsWith("/admin/sprints")}>
                    Sprints
                  </DropdownLink>

                  <div className="px-3 py-2 border-b border-t border-gray-100 dark:border-gray-800 mt-1">
                    <p className="text-xs font-medium text-amber-500 dark:text-amber-400 uppercase tracking-wider">
                      07 — Astrolytics
                    </p>
                  </div>
                  <DropdownLink href="/astrolytics" current={pathname.startsWith("/astrolytics")}>
                    Analytics Dashboard
                  </DropdownLink>
                  <DropdownLink href="/admin/plugin" current={pathname === "/admin/plugin"}>
                    Plugin Config
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
        </div>
      </header>

        {/* Main content + Astra side-by-side */}
        <div className="flex">
          <main className={`flex-1 min-w-0 transition-all duration-300 ${astraOpen ? "lg:w-2/3" : "w-full"}`}>
            {children}
          </main>

          <AstraChatPanel
            isOpen={astraOpen}
            onClose={() => setAstraOpen(false)}
            messages={astraMessages}
            isStreaming={astraStreaming}
            onSendMessage={astraSendMessage}
            onClearChat={astraClearChat}
            agentId={astraContext.agentId}
          />
        </div>

        {/* Astra Toggle */}
        <AstraChatToggle isOpen={astraOpen} onClick={() => setAstraOpen(true)} />
      </div>
    </AdminContext.Provider>
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
