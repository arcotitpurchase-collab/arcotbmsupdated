import {
  SYSTEM_ROLES,
  USER_PERMISSIONS,
} from "../data/permissionOptions";
import {
  clearCurrentSession,
  getAdmins,
  getCurrentSession,
  getSuperAdmin,
  getUsers,
  saveAdmins,
  saveCurrentSession,
  saveSuperAdmin,
  saveUsers,
} from "./storageService";

const normalizeEmail = (email = "") =>
  String(email).trim().toLowerCase();

const normalizeStatus = (status = "ACTIVE") =>
  String(status).trim().toUpperCase();

const removePassword = (account) => {
  if (!account) {
    return null;
  }

  const { password, ...safeAccount } = account;
  return safeAccount;
};

const getAllAccounts = () => {
  const superAdmin = getSuperAdmin();

  return [
    ...(superAdmin ? [superAdmin] : []),
    ...getAdmins(),
    ...getUsers(),
  ];
};

export const findAccountBySession = (session) => {
  if (!session?.accountId || !session?.systemRole) {
    return null;
  }

  return (
    getAllAccounts().find(
      (account) =>
        String(account.id) === String(session.accountId) &&
        account.systemRole === session.systemRole
    ) || null
  );
};

export const validateAccountStatus = (account) => {
  if (!account) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  if (account.isDeleted || account.deletedAt) {
    return {
      success: false,
      message: "This account has been deleted.",
    };
  }

  if (
    account.isActive === false ||
    normalizeStatus(account.status) !== "ACTIVE"
  ) {
    return {
      success: false,
      message: "This account is disabled.",
    };
  }

  if (
    account.systemRole === SYSTEM_ROLES.USER &&
    !account.permissions?.includes(USER_PERMISSIONS.LOGIN)
  ) {
    return {
      success: false,
      message: "Login permission is not enabled for this user.",
    };
  }

  return { success: true };
};

export const updateLastLogin = (account) => {
  const lastLoginAt = new Date().toISOString();

  if (account.systemRole === SYSTEM_ROLES.SUPER_ADMIN) {
    saveSuperAdmin({
      ...account,
      lastLoginAt,
      updatedAt: lastLoginAt,
    });
  }

  if (account.systemRole === SYSTEM_ROLES.ADMIN) {
    saveAdmins(
      getAdmins().map((admin) =>
        String(admin.id) === String(account.id)
          ? { ...admin, lastLoginAt, updatedAt: lastLoginAt }
          : admin
      )
    );
  }

  if (account.systemRole === SYSTEM_ROLES.USER) {
    saveUsers(
      getUsers().map((user) =>
        String(user.id) === String(account.id)
          ? { ...user, lastLoginAt, updatedAt: lastLoginAt }
          : user
      )
    );
  }

  return {
    ...account,
    lastLoginAt,
    updatedAt: lastLoginAt,
  };
};

export const createSession = (account) => {
  const session = {
    accountId: account.id,
    systemRole: account.systemRole,
    email: normalizeEmail(account.email || account.adminEmail),
    name: account.name || account.adminName || "User",
    permissions: Array.isArray(account.permissions)
      ? account.permissions
      : [],
    assignedClientIds: Array.isArray(account.assignedClientIds)
      ? account.assignedClientIds
      : [],
    assignedBuildingIds: Array.isArray(account.assignedBuildingIds)
      ? account.assignedBuildingIds
      : [],
    assignedBlockIds: Array.isArray(account.assignedBlockIds)
      ? account.assignedBlockIds
      : [],
    assignedFloorIds: Array.isArray(account.assignedFloorIds)
      ? account.assignedFloorIds
      : [],
    assignedZoneIds: Array.isArray(account.assignedZoneIds)
      ? account.assignedZoneIds
      : [],
    assignedSystemIds: Array.isArray(account.assignedSystemIds)
      ? account.assignedSystemIds
      : [],
    loginAt: new Date().toISOString(),
  };

  saveCurrentSession(session);
  return session;
};

export const getLandingRoute = (account) => {
  const routes = {
    [SYSTEM_ROLES.SUPER_ADMIN]: "/super-admin",
    [SYSTEM_ROLES.ADMIN]: "/dashboard",
    [SYSTEM_ROLES.USER]: "/dashboard",
  };

  return routes[account?.systemRole] || "/access-denied";
};

export const authenticateAccount = (email, password) => {
  const normalizedEmail = normalizeEmail(email);
  const submittedPassword = String(password ?? "");

  const account = getAllAccounts().find(
    (item) =>
      normalizeEmail(item.email || item.adminEmail) ===
      normalizedEmail
  );

  if (!account || account.password !== submittedPassword) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const statusResult = validateAccountStatus(account);

  if (!statusResult.success) {
    return statusResult;
  }

  const updatedAccount = updateLastLogin(account);
  const session = createSession(updatedAccount);

  return {
    success: true,
    account: removePassword(updatedAccount),
    session,
    landingRoute: getLandingRoute(updatedAccount),
  };
};

export const getCurrentAccount = () => {
  const account = findAccountBySession(getCurrentSession());
  const statusResult = validateAccountStatus(account);

  if (!statusResult.success) {
    return null;
  }

  return removePassword(account);
};

export const logout = () => {
  clearCurrentSession();
};
