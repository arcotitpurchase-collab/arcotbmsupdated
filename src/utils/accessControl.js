import { SYSTEM_ROLES, USER_PERMISSIONS } from "../data/permissionOptions";
import { buildings as bmsBuildings, clients as bmsClients } from "../data/bmsData";
import {
  getBlockById,
  getBuildingById,
  getClientById,
  getFloorById,
  normalizeId,
  getZoneById,
  getZonesForFloor,
  hierarchySnapshot,
} from "./bmsHierarchy";

const asStrings = (values) =>
  Array.isArray(values)
    ? values.map((value) => normalizeId(value).trim()).filter(Boolean)
    : [];

const includesId = (values, id) =>
  asStrings(values).includes(normalizeId(id));

export const isSuperAdmin = (account) =>
  account?.systemRole === SYSTEM_ROLES.SUPER_ADMIN ||
  account?.role === SYSTEM_ROLES.SUPER_ADMIN;

export const isAdmin = (account) =>
  account?.systemRole === SYSTEM_ROLES.ADMIN ||
  account?.role === SYSTEM_ROLES.ADMIN;

export const canInteractWithInternalFlow = (account) =>
  isSuperAdmin(account) || isAdmin(account);

const hasFullProjectAccess = (account) =>
  isSuperAdmin(account) || isAdmin(account);

const STANDARD_MONITORING_PERMISSIONS = new Set([
  USER_PERMISSIONS.LOGIN,
  USER_PERMISSIONS.DASHBOARD_VIEW,
  USER_PERMISSIONS.LIVE_MONITORING_VIEW,
  USER_PERMISSIONS.ANALYTICS_VIEW,
  USER_PERMISSIONS.CONSUMPTION_VIEW,
  USER_PERMISSIONS.ALERTS_VIEW,
]);

const getAssignedZoneSet = (account) =>
  new Set(asStrings(account?.assignedZoneIds));

const getAssignedZones = (account) => {
  const assignedZoneIds = getAssignedZoneSet(account);

  return hierarchySnapshot.zones.filter((zone) =>
    assignedZoneIds.has(normalizeId(zone.id))
  );
};

export const hasPermission = (account, permission) => {
  if (!account) return false;
  if (isSuperAdmin(account) || isAdmin(account)) return true;
  if (
    account.systemRole === SYSTEM_ROLES.USER &&
    STANDARD_MONITORING_PERMISSIONS.has(permission)
  ) {
    return true;
  }
  return account.permissions?.includes(permission);
};

export const normalizeFloorId = (buildingId, floorId) => {
  const value = String(floorId || "");
  return value.includes(":") ? value : `${buildingId}:${value}`;
};

export const normalizeBlockId = (buildingId, blockId) =>
  blockId || `${buildingId}-core`;

export const getClientIdFromRoute = (floorId, clientRouteId) => {
  const floorNumber = Number(floorId) || 1;
  const clientNumber = Number(clientRouteId) || 1;
  const index = (floorNumber - 1) * 4 + clientNumber - 1;
  return bmsClients[index] || null;
};

export const canAccessClient = (account, clientId) => {
  if (!account || !clientId || !getClientById(clientId)) return false;
  if (hasFullProjectAccess(account)) return true;
  return getAssignedZones(account).some(
    (zone) => normalizeId(zone.clientId) === normalizeId(clientId)
  );
};

export const canAccessBuilding = (account, buildingId) => {
  if (!account || !buildingId || !getBuildingById(buildingId)) return false;
  if (hasFullProjectAccess(account)) return true;
  return getAssignedZones(account).some(
    (zone) => normalizeId(zone.buildingId) === normalizeId(buildingId)
  );
};

export const canAccessWing = canAccessBuilding;

export const canAccessBlock = (account, blockId) => {
  if (!account || !blockId || !getBlockById(blockId)) return false;
  if (hasFullProjectAccess(account)) return true;
  return getAssignedZones(account).some(
    (zone) => normalizeId(zone.blockId) === normalizeId(blockId)
  );
};

export const canAccessFloor = (account, floorId) => {
  if (!account || !floorId || !getFloorById(floorId)) return false;
  if (hasFullProjectAccess(account)) return true;
  const assignedZoneIds = new Set(asStrings(account.assignedZoneIds));

  return getZonesForFloor(floorId).some((zone) =>
    assignedZoneIds.has(normalizeId(zone.id))
  );
};

export const canAccessZone = (account, zoneId) => {
  if (!account || !zoneId || !getZoneById(zoneId)) return false;
  if (hasFullProjectAccess(account)) return true;
  return includesId(account.assignedZoneIds, zoneId);
};

export const canAccessSystem = (account, systemId) => {
  if (!account || !systemId) return false;
  if (hasFullProjectAccess(account)) return true;
  const system =
    hierarchySnapshot.systems.find(
      (item) => normalizeId(item.id) === normalizeId(systemId)
    ) || null;

  return system ? canAccessFloor(account, system.floorId) : false;
};

export const filterClientsForAccount = (account, clients = []) => {
  const normalized = clients.map((client) =>
    typeof client === "string" ? { id: client, name: client } : client
  );

  return hasFullProjectAccess(account)
    ? normalized
    : normalized.filter((client) => canAccessClient(account, client.id));
};

export const filterBuildingsForAccount = (account, buildings = []) =>
  hasFullProjectAccess(account)
    ? buildings
    : buildings.filter((building) => canAccessBuilding(account, building.id));

export const filterBlocksForAccount = (account, blocks = []) =>
  hasFullProjectAccess(account)
    ? blocks
    : blocks.filter((block) => canAccessBlock(account, block.id));

export const filterFloorsForAccount = (account, floors = []) =>
  hasFullProjectAccess(account)
    ? floors
    : floors.filter((floor) => canAccessFloor(account, floor.id));

export const filterSystemsForAccount = (account, systems = []) =>
  hasFullProjectAccess(account)
    ? systems
    : systems.filter((system) => canAccessSystem(account, system.id));

export const getAccessibleZoneIds = (account) =>
  hasFullProjectAccess(account)
    ? hierarchySnapshot.zones.map((zone) => zone.id)
    : asStrings(account?.assignedZoneIds);

export const filterZonesForAccount = (account, zones = []) =>
  hasFullProjectAccess(account)
    ? zones
    : zones.filter((zone) => canAccessZone(account, zone.id));

export const filterReadingsForAccount = (account, readings = []) =>
  hasFullProjectAccess(account)
    ? readings
    : readings.filter((reading) => {
        if (reading.clientId && !canAccessClient(account, reading.clientId)) return false;
        if (reading.buildingId && !canAccessBuilding(account, reading.buildingId)) return false;
        if (reading.blockId && !canAccessBlock(account, reading.blockId)) return false;
        if (reading.floorId && !canAccessFloor(account, reading.floorId)) return false;
        if (reading.zoneId && !canAccessZone(account, reading.zoneId)) return false;
        if (reading.systemId && !canAccessSystem(account, reading.systemId)) return false;
        return true;
      });

export const filterZoneReadingsForAccount = filterReadingsForAccount;

export const validateRouteAccess = (account, routeType, resourceId) => {
  if (routeType === "client") return canAccessClient(account, resourceId);
  if (routeType === "building") return canAccessBuilding(account, resourceId);
  if (routeType === "block") return canAccessBlock(account, resourceId);
  if (routeType === "floor") return canAccessFloor(account, resourceId);
  if (routeType === "zone") return canAccessZone(account, resourceId);
  if (routeType === "system") return canAccessSystem(account, resourceId);
  return Boolean(account);
};

export const resolveAccountLandingRoute = (account) => {
  if (!account) return "/auth";
  if (account.systemRole === SYSTEM_ROLES.SUPER_ADMIN) return "/super-admin";
  if (account.systemRole === SYSTEM_ROLES.ADMIN) return "/admin/dashboard";
  return "/dashboard";
};

export const getFirstAccessibleBuilding = (account) =>
  filterBuildingsForAccount(account, bmsBuildings)[0] || null;

export const getFirstAccessibleFloor = (account, buildingId) =>
  filterFloorsForAccount(
    account,
    hierarchySnapshot.floors.filter((floor) => floor.buildingId === buildingId)
  )[0] || null;

export const resolveNearestAllowedParentRoute = (account, resource = {}) => {
  if (!account) return "/auth";

  if (resource.buildingId && canAccessBuilding(account, resource.buildingId)) {
    return `/building/${resource.buildingId}`;
  }

  const firstBuilding = getFirstAccessibleBuilding(account);
  if (firstBuilding) return "/dashboard";

  return "/access-denied";
};

export const calculateScopedConsumption = (account, readings = []) =>
  filterReadingsForAccount(account, readings).reduce(
    (sum, row) => sum + Number(row.energyKwh || row.consumption || 0),
    0
  );

export const calculateScopedCharges = (account, readingsOrCharges = []) =>
  filterReadingsForAccount(account, readingsOrCharges).reduce(
    (sum, row) => sum + Number(row.charges || Number(row.energyKwh || 0) * 8.5),
    0
  );

export const hasAnyAssignedScope = (account) =>
  hasFullProjectAccess(account) ||
  asStrings(account?.assignedZoneIds).length > 0;
