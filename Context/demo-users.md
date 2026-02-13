# Nova Demo Users

All users use the domain `@novademo.com` and are part of the **Demo Company** tenant.

---

## Quick Login Reference

| Group | Example Email | Password | Access Level |
|-------|--------------|----------|--------------|
| Leadership | steven@novademo.com | demo123 | Demo Mode |
| Product Team | daniel@novademo.com | demo123 | Full Access |
| Team Members | meagan@novademo.com | demo123 | Read-only + Comments |
| Clients | werner@novademo.com | demo123 | Demo Mode |

---

## Leadership (7 users)
**Role:** ADMIN with Demo Mode enabled
**Access:** Can see all UI and interact, but changes don't persist to database. Gets a popup directing them to contact the Product Team.

| Name | Email | Password |
|------|-------|----------|
| Steven | steven@novademo.com | demo123 |
| Marcel | marcel@novademo.com | demo123 |
| Bavini | bavini@novademo.com | demo123 |
| Dee | dee@novademo.com | demo123 |
| Dave | dave@novademo.com | demo123 |
| Sonja | sonja@novademo.com | demo123 |
| Luis | luis@novademo.com | demo123 |

---

## Product Team (3 users)
**Role:** ADMIN with Full Access
**Access:** Can create voting sessions, create/edit/delete problems, move problems between groups, change problem status. Full CRUD operations.

| Name | Email | Password |
|------|-------|----------|
| Daniel | daniel@novademo.com | demo123 |
| Jacques | jacques@novademo.com | demo123 |
| Ray | ray@novademo.com | demo123 |

---

## Team Members (12 users)
**Role:** MEMBER
**Access:** Read-only on problems, can leave comments, can vote when invited to sessions, can favorite problems.

| Name | Email | Password |
|------|-------|----------|
| Meagan | meagan@novademo.com | demo123 |
| Matt | matt@novademo.com | demo123 |
| Flo | flo@novademo.com | demo123 |
| Courtney | courtney@novademo.com | demo123 |
| Nikolay | nikolay@novademo.com | demo123 |
| Carmen | carmen@novademo.com | demo123 |
| Larissa | larissa@novademo.com | demo123 |
| Rouleaux | rouleaux@novademo.com | demo123 |
| Muzi | muzi@novademo.com | demo123 |
| Liezahn | liezahn@novademo.com | demo123 |
| Camilla | camilla@novademo.com | demo123 |
| Kylan | kylan@novademo.com | demo123 |

---

## Clients (4 users)
**Role:** ADMIN with Demo Mode enabled
**Access:** Same as Leadership - can see all UI and interact, but changes don't persist.

| Name | Email | Password |
|------|-------|----------|
| Werner | werner@novademo.com | demo123 |
| Isak | isak@novademo.com | demo123 |
| Chantelle | chantelle@novademo.com | demo123 |
| Lewy | lewy@novademo.com | demo123 |

---

## VoterGroups

These groups are used for voting session organization and credit allocation:

| Group Name | Type | Default Credits |
|------------|------|-----------------|
| Leadership | LEADERSHIP | 50 |
| Product Team | PROJECT_TEAM | 30 |
| Team Members | PROJECT_TEAM | 10 |
| Clients | EXTERNAL_USER | 50 |

---

## Permission Summary

| Capability | FDE | Product Team | Leadership (Demo) | Team Members | Clients (Demo) |
|------------|-----|--------------|-------------------|--------------|----------------|
| View Problems | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Problems | ✅ | ✅ | ❌ (blocked) | ❌ | ❌ (blocked) |
| Edit Problems | ✅ | ✅ | ❌ (blocked) | ❌ | ❌ (blocked) |
| Delete Problems | ✅ | ✅ | ❌ (blocked) | ❌ | ❌ (blocked) |
| Create Sessions | ✅ | ✅ | ❌ (blocked) | ❌ | ❌ (blocked) |
| Add Comments | ✅ | ✅ | ✅ | ✅ | ✅ |
| Favorite Problems | ✅ | ✅ | ✅ | ✅ | ✅ |
| Vote in Sessions | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Results (after voting) | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## System Users (for reference)

| Email | Password | Role |
|-------|----------|------|
| fde@nova.ai | password123 | FDE (Super Admin) |
| admin@demo.com | password123 | ADMIN |
