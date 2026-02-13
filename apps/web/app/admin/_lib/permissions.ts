import { AuthUser } from './types';

/**
 * Permission utilities for role-based access control
 */

/**
 * Check if user is in demo mode (can see UI but changes don't persist)
 */
export function isDemoMode(user: AuthUser | null): boolean {
  return user?.isDemoMode ?? false;
}

/**
 * Check if user is read-only (MEMBER or VOTER roles)
 */
export function isReadOnly(user: AuthUser | null): boolean {
  if (!user) return true;
  return user.role === 'MEMBER' || user.role === 'VOTER';
}

/**
 * Check if user has admin/FDE privileges
 */
export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === 'FDE' || user.role === 'ADMIN';
}

/**
 * Check if user can create/edit/delete problems
 */
export function canManageProblems(user: AuthUser | null): boolean {
  if (!user) return false;
  // FDE and ADMIN can manage, but demo mode users will be blocked by API
  return user.role === 'FDE' || user.role === 'ADMIN';
}

/**
 * Check if user can create/edit voting sessions
 */
export function canManageSessions(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === 'FDE' || user.role === 'ADMIN';
}

/**
 * Check if user can access admin session management routes
 * Only FDE and non-demo ADMIN users can manage sessions
 */
export function canAccessAdminSessions(user: AuthUser | null): boolean {
  if (!user) return false;
  if (user.role === 'FDE') return true;
  if (user.role === 'ADMIN' && !user.isDemoMode) return true;
  return false;
}

/**
 * Check if user should be redirected to voter interface
 * Demo mode users and non-admin roles should use voter interface for sessions
 */
export function shouldUseVoterInterface(user: AuthUser | null): boolean {
  if (!user) return true;
  if (user.role === 'MEMBER' || user.role === 'VOTER') return true;
  if (user.role === 'ADMIN' && user.isDemoMode) return true;
  return false;
}

/**
 * Check if user can add comments (all roles except VOTER without session)
 */
export function canComment(user: AuthUser | null): boolean {
  if (!user) return false;
  return true; // All authenticated users can comment
}

/**
 * Check if user can add favorites
 */
export function canFavorite(user: AuthUser | null): boolean {
  if (!user) return false;
  return true; // All authenticated users can favorite
}

/**
 * Check if user can vote in sessions
 */
export function canVote(user: AuthUser | null): boolean {
  if (!user) return false;
  return true; // All authenticated users can vote when invited
}

/**
 * Demo mode error response structure from API
 */
export interface DemoModeError {
  statusCode: 403;
  demoMode: true;
  message: string;
  contactTeam: Array<{
    name: string;
    email: string;
  }>;
}

/**
 * Check if an API error is a demo mode restriction
 */
export function isDemoModeError(error: unknown): error is DemoModeError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'demoMode' in error &&
    (error as DemoModeError).demoMode === true
  );
}

/**
 * Product team contacts for demo mode users
 */
export const PRODUCT_TEAM = [
  { name: 'Daniel', email: 'daniel@novademo.com' },
  { name: 'Jacques', email: 'jacques@novademo.com' },
  { name: 'Ray', email: 'ray@novademo.com' },
];
