import {
  ADMIN_PERMISSIONS,
  SYSTEM_ROLES,
  USER_PERMISSIONS,
} from "../data/permissionOptions";
import { buildings, clients, powerAssets } from "../data/bmsData";
import { migrateFloorAssignmentsToZones } from "../utils/bmsHierarchy";

export const STORAGE_KEYS = {
  SUPER_ADMIN: "bms_super_admin",
  ADMINS: "bms_admins",
  USERS: "bms_users",
  SESSION: "bms_current_session",
  AUTH_VERSION: "bms_auth_version",
};

const AUTH_VERSION = "5";

const createId = (prefix) => {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

const safeParse = (key, fallback) => {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(storedValue);
    return parsed ?? fallback;
  } catch (error) {
    console.error(`Unable to parse ${key}:`, error);
    return fallback;
  }
};

const saveJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const firstBuildingId = buildings[0]?.id || "wing-a";
const firstBlockId = `${firstBuildingId}-core`;
const adminFloorIds = ["1", "2", "3", "4", "5"].map(
  (floorId) => `${firstBuildingId}:${floorId}`
);
const userFloorIds = ["1", "2"].map(
  (floorId) => `${firstBuildingId}:${floorId}`
);
const adminClientIds = clients.slice(0, 20);
const userClientIds = clients.slice(0, 4);
const adminSystemIds = adminFloorIds.flatMap((floorId) =>
  powerAssets.slice(0, 2).map((asset) => `${floorId}:${asset.id}`)
);
const userSystemIds = userFloorIds.flatMap((floorId) =>
  powerAssets.slice(0, 1).map((asset) => `${floorId}:${asset.id}`)
);

const baseScope = {
  assignedClientIds: [],
  assignedBuildingIds: [],
  assignedBlockIds: [],
  assignedFloorIds: [],
  assignedZoneIds: [],
  assignedSystemIds: [],
};

const uniqueStrings = (values) => [
  ...new Set(
    (Array.isArray(values) ? values : [])
      .map((value) => String(value).trim())
      .filter(Boolean)
  ),
];

const normalizeScopeArrays = (account) => {
  const assignedBuildingIds = uniqueStrings(
    account?.assignedBuildingIds
  );
  const fallbackBuildingId =
    assignedBuildingIds[0] || firstBuildingId;
  const assignedBlockIds = uniqueStrings(
    account?.assignedBlockIds?.length
      ? account.assignedBlockIds
      : assignedBuildingIds.map((buildingId) => `${buildingId}-core`)
  );
  const assignedFloorIds = uniqueStrings(
    account?.assignedFloorIds
  ).map((floorId) =>
    floorId.includes(":")
      ? floorId
      : `${fallbackBuildingId}:${floorId}`
  );
  const assignedSystemIds = uniqueStrings(
    account?.assignedSystemIds
  ).flatMap((systemId) => {
    if (systemId.includes(":")) {
      return [systemId];
    }

    const assetExists = powerAssets.some(
      (asset) => asset.id === systemId
    );

    if (!assetExists) {
      return [systemId];
    }

    return (assignedFloorIds.length
      ? assignedFloorIds
      : [`${fallbackBuildingId}:1`]
    ).map((floorId) => `${floorId}:${systemId}`);
  });
  const hasAssignedZoneIds = Object.prototype.hasOwnProperty.call(
    account ?? {},
    "assignedZoneIds"
  );
  const zoneScope = migrateFloorAssignmentsToZones({
    ...account,
    assignedBuildingIds,
    assignedBlockIds,
    assignedFloorIds,
    assignedSystemIds,
    assignedZoneIds: hasAssignedZoneIds
      ? uniqueStrings(account?.assignedZoneIds)
      : undefined,
  });

  return {
    ...account,
    isActive:
      typeof account?.isActive === "boolean"
        ? account.isActive
        : String(account?.status || "ACTIVE").toUpperCase() ===
          "ACTIVE",
    assignedClientIds: zoneScope.assignedClientIds,
    assignedBuildingIds,
    assignedBlockIds: zoneScope.assignedBlockIds,
    assignedFloorIds: zoneScope.assignedFloorIds,
    assignedZoneIds: zoneScope.assignedZoneIds,
    assignedSystemIds,
  };
};

const createDemoData = () => {
  const createdAt = new Date().toISOString();
  const adminId = "admin-demo-arcot";

  return {
    superAdmin: {
      id: "super-admin-demo-arcot",
      name: "ARCOT Super Admin",
      email: "superadmin@arcot.com",
      password: "Super@123",
      systemRole: SYSTEM_ROLES.SUPER_ADMIN,
      status: "ACTIVE",
      isActive: true,
      isDeleted: false,
      ...baseScope,
      permissions: Object.values(ADMIN_PERMISSIONS),
      createdAt,
      updatedAt: createdAt,
      lastLoginAt: null,
    },
    admins: [
      {
        id: adminId,
        systemRole: SYSTEM_ROLES.ADMIN,
        // companyName: "Prestige Tech Park",
        // buildingName: "Wing A - Floors 1 to 5",
        
        name: "ARCOT Admin",
        adminName: "ARCOT Admin",
        email: "admin@arcot.com",
        adminEmail: "admin@arcot.com",
        password: "Admin@123",
        phone: "+91 98765 43210",
        status: "ACTIVE",
        isActive: true,
        isDeleted: false,
        permissions: Object.values(ADMIN_PERMISSIONS),
        assignedClientIds: adminClientIds,
        assignedBuildingIds: [firstBuildingId],
        assignedBlockIds: [firstBlockId],
        assignedFloorIds: adminFloorIds,
        assignedZoneIds: [],
        assignedSystemIds: adminSystemIds,
        addons: [],
        cloudUsage: {
          storageGB: 20,
          apiCalls: 12000,
          devices: 5,
          dataTransferGB: 10,
        },
        createdAt,
        updatedAt: createdAt,
        lastLoginAt: null,
      },
    ],
    users: [
      {
        id: "user-demo-arcot",
        systemRole: SYSTEM_ROLES.USER,
        role: SYSTEM_ROLES.USER,
        adminId,
        createdBy: adminId,
        companyName: "Prestige Tech Park",
        buildingName: "Wing A - Floors 1 to 2",
        name: "ARCOT User",
        email: "user@arcot.com",
        password: "User@123",
        designation: "VIEWER",
        accessType: "BUILDING",
        accessName: "Wing A / Floors 1 to 2",
        status: "ACTIVE",
        isActive: true,
        isDeleted: false,
        permissions: Object.values(USER_PERMISSIONS),
        assignedClientIds: userClientIds,
        assignedBuildingIds: [firstBuildingId],
        assignedBlockIds: [firstBlockId],
        assignedFloorIds: userFloorIds,
        assignedZoneIds: [],
        assignedSystemIds: userSystemIds,
        addedBy: "admin@arcot.com",
        createdAt,
        updatedAt: createdAt,
        lastLoginAt: null,
      },
    ],
  };
};

const isValidObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const isValidAccountArray = (value) => Array.isArray(value);

const readArray = (key) => {
  const value = safeParse(key, []);
  return Array.isArray(value)
    ? value.map(normalizeScopeArrays)
    : [];
};

export const initializeMockData = () => {
  const demoData = createDemoData();
  const storedVersion = localStorage.getItem(STORAGE_KEYS.AUTH_VERSION);
  const shouldMigrate = storedVersion !== AUTH_VERSION;

  const superAdmin = safeParse(STORAGE_KEYS.SUPER_ADMIN, null);
  const admins = safeParse(STORAGE_KEYS.ADMINS, null);
  const users = safeParse(STORAGE_KEYS.USERS, null);

  if (!isValidObject(superAdmin)) {
    saveSuperAdmin(demoData.superAdmin);
  } else if (shouldMigrate) {
    saveSuperAdmin(superAdmin);
  }

  if (!isValidAccountArray(admins)) {
    saveAdmins(demoData.admins);
  } else if (shouldMigrate) {
    saveAdmins(admins);
  }

  if (!isValidAccountArray(users)) {
    saveUsers(demoData.users);
  } else if (shouldMigrate) {
    saveUsers(users);
  }

  localStorage.setItem(STORAGE_KEYS.AUTH_VERSION, AUTH_VERSION);

  return {
    superAdmin: getSuperAdmin(),
    admins: getAdmins(),
    users: getUsers(),
  };
};

export const getSuperAdmin = () => {
  const value = safeParse(STORAGE_KEYS.SUPER_ADMIN, null);

  if (!isValidObject(value)) {
    return null;
  }

  return normalizeScopeArrays(value);
};

export const saveSuperAdmin = (superAdmin) =>
  saveJson(
    STORAGE_KEYS.SUPER_ADMIN,
    normalizeScopeArrays(superAdmin)
  );

export const getAdmins = () => readArray(STORAGE_KEYS.ADMINS);

export const saveAdmins = (admins) =>
  saveJson(
    STORAGE_KEYS.ADMINS,
    Array.isArray(admins)
      ? admins.map(normalizeScopeArrays)
      : []
  );

export const getUsers = () => readArray(STORAGE_KEYS.USERS);

export const saveUsers = (users) =>
  saveJson(
    STORAGE_KEYS.USERS,
    Array.isArray(users)
      ? users.map(normalizeScopeArrays)
      : []
  );

export const getCurrentSession = () => {
  const session = safeParse(STORAGE_KEYS.SESSION, null);
  return isValidObject(session) ? session : null;
};

export const saveCurrentSession = (session) =>
  saveJson(STORAGE_KEYS.SESSION, session);

export const clearCurrentSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const resetMockApplication = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

  return initializeMockData();
};

export const getMockDatabase = () => {
  initializeMockData();

  return {
    superAdmins: getSuperAdmin() ? [getSuperAdmin()] : [],
    admins: getAdmins(),
    users: getUsers(),
  };
};

export const saveMockDatabase = (data) => {
  if (Array.isArray(data?.superAdmins) && data.superAdmins[0]) {
    saveSuperAdmin(data.superAdmins[0]);
  }

  if (Array.isArray(data?.admins)) {
    saveAdmins(data.admins);
  }

  if (Array.isArray(data?.users)) {
    saveUsers(data.users);
  }

  return getMockDatabase();
};

export { createId };
