import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADMIN_PERMISSIONS,
  SYSTEM_ROLES,
  USER_PERMISSION_OPTIONS,
} from "./data/permissionOptions";
import { useAuth } from "./context/AuthContext";
import {
  createUser,
  getAdminDashboardSummary,
  getGrantableUserPermissions,
  getUserByIdForAdmin,
  getUserFormOptions,
  getUsersForAdmin,
  isDeleted,
  resetUserPassword,
  restoreUser,
  setUserStatus,
  softDeleteUser,
  updateUser,
} from "./services/userService";
import { normalizeId } from "./utils/bmsHierarchy";

const permissionLabels = Object.fromEntries(
  USER_PERMISSION_OPTIONS.map((permission) => [
    permission.id,
    permission.label,
  ])
);

const cloneArray = (values) =>
  Array.isArray(values) ? values.map(normalizeId).filter(Boolean) : [];

const createInitialUserForm = () => ({
  name: "",
  email: "",
  temporaryPassword: "",
  mustChangePassword: true,
  isActive: true,
  assignedClientIds: [],
  assignedBuildingIds: [],
  assignedBlockIds: [],
  assignedFloorIds: [],
  assignedZoneIds: [],
  permissions: [],
});

const createEditUserForm = (user) => ({
  id: user?.id ?? "",
  name: user?.name ?? "",
  email: user?.email ?? "",
  temporaryPassword: "",
  mustChangePassword: Boolean(user?.mustChangePassword),
  isActive: user?.isActive !== false && !isDeleted(user),
  assignedClientIds: cloneArray(user?.assignedClientIds),
  assignedBuildingIds: cloneArray(user?.assignedBuildingIds),
  assignedBlockIds: cloneArray(user?.assignedBlockIds),
  assignedFloorIds: cloneArray(user?.assignedFloorIds),
  assignedZoneIds: cloneArray(user?.assignedZoneIds),
  permissions: cloneArray(user?.permissions),
});

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getStatusText = (user) => {
  if (isDeleted(user)) return "Deleted";
  return user.isActive === false ? "Disabled" : "Active";
};

function SummaryCard({ title, value, sub, accent = false }) {
  return (
    <article
      className={`border p-4 ${
        accent
          ? "border-cyan-400/40 bg-cyan-400/[0.08]"
          : "border-white/10 bg-white/[0.05]"
      }`}
    >
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>
      <p
        className={`mt-2 truncate text-[22px] font-semibold ${
          accent ? "text-cyan-300" : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1 truncate text-[11px] text-slate-500">
          {sub}
        </p>
      )}
    </article>
  );
}

function StatusBadge({ user }) {
  const status = getStatusText(user);
  const styles = {
    Active:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    Disabled:
      "border-amber-400/30 bg-amber-400/10 text-amber-300",
    Deleted:
      "border-red-400/30 bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={`inline-flex border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}

const toLabelArray = (values) =>
  (Array.isArray(values) ? values : [])
    .map((value) => {
      if (value && typeof value === "object") {
        return value.name || value.label || value.title || value.id || "";
      }

      return value;
    })
    .map((value) => String(value || "").trim())
    .filter(Boolean);

function BadgeList({ values, tone = "slate" }) {
  const labels = toLabelArray(values);
  const styles =
    tone === "cyan"
      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
      : "border-white/10 bg-[#06184A] text-slate-300";

  if (labels.length === 0) {
    return <span className="text-slate-500">—</span>;
  }

  return (
    <div className="flex max-w-full flex-wrap gap-1">
      {labels.map((label) => (
        <span
          key={label}
          className={`max-w-[180px] truncate border px-2 py-1 text-[10px] font-semibold ${styles}`}
          title={label}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function PermissionBadgeList({ permissions }) {
  const labels = toLabelArray(permissions).map(
    (permission) => permissionLabels[permission] || permission
  );

  return <BadgeList values={labels} tone="cyan" />;
}

function TextField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-10 w-full border border-white/10 bg-[#06184A] px-3 text-sm text-white outline-none focus:border-cyan-400"
      />
      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-300">
          {error}
        </p>
      )}
    </label>
  );
}

function PermissionPicker({
  grantablePermissions,
  selectedPermissions,
  onToggle,
  error,
}) {
  return (
    <section className="mt-5 border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            Dashboard Features
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Fresh grantable feature list for this Admin.
          </p>
        </div>
        <span className="border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-200">
          {selectedPermissions.length} selected
        </span>
      </div>

      {error && (
        <p className="mt-2 text-[11px] font-medium text-red-300">
          {error}
        </p>
      )}

      {grantablePermissions.length === 0 ? (
        <p className="mt-4 border border-amber-400/30 bg-amber-400/10 px-3 py-3 text-xs text-amber-200">
          This Admin does not have any User dashboard features available to grant.
        </p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {grantablePermissions.map((permission) => {
            const checked = selectedPermissions.includes(permission.id);

            return (
              <label
                key={permission.id}
                className={`flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 text-xs transition ${
                  checked
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-100"
                    : "border-white/10 bg-[#06184A] text-slate-300 hover:border-cyan-400/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(permission.id)}
                />
                <span>{permission.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}

function FloorZoneAssignment({
  zones,
  selectedZoneIds,
  onChange,
  error,
}) {
  const [query, setQuery] = React.useState("");
  const selected = new Set(selectedZoneIds.map(normalizeId));
  const normalizedQuery = query.trim().toLowerCase();

  const groupedBuildings = React.useMemo(() => {
    const buildings = new Map();

    zones.forEach((zone) => {
      const searchable = [
        zone.buildingName,
        zone.floorName,
        zone.zoneName,
        zone.zoneLabel,
      ]
        .join(" ")
        .toLowerCase();

      if (normalizedQuery && !searchable.includes(normalizedQuery)) {
        return;
      }

      if (!buildings.has(zone.buildingId)) {
        buildings.set(zone.buildingId, {
          id: zone.buildingId,
          name: zone.buildingName,
          floors: new Map(),
        });
      }

      const building = buildings.get(zone.buildingId);

      if (!building.floors.has(zone.floorId)) {
        building.floors.set(zone.floorId, {
          id: zone.floorId,
          name: zone.floorName,
          floorNumber: zone.floorNumber,
          zones: [],
        });
      }

      building.floors.get(zone.floorId).zones.push(zone);
    });

    return [...buildings.values()].map((building) => ({
      ...building,
      floors: [...building.floors.values()],
    }));
  }, [normalizedQuery, zones]);

  const toggleZone = (zoneId) => {
    const normalizedZoneId = normalizeId(zoneId);

    onChange(
      selected.has(normalizedZoneId)
        ? selectedZoneIds.filter(
            (id) => normalizeId(id) !== normalizedZoneId
          )
        : [...selectedZoneIds, normalizedZoneId]
    );
  };

  const toggleFloor = (floorZones) => {
    const floorZoneIds = floorZones.map((zone) => normalizeId(zone.id));
    const allSelected = floorZoneIds.every((zoneId) =>
      selected.has(zoneId)
    );

    if (allSelected) {
      onChange(
        selectedZoneIds.filter(
          (zoneId) => !floorZoneIds.includes(normalizeId(zoneId))
        )
      );
      return;
    }

    onChange([...new Set([...selectedZoneIds, ...floorZoneIds])]);
  };

  const selectedBuildings = new Set(
    zones
      .filter((zone) => selected.has(normalizeId(zone.id)))
      .map((zone) => zone.buildingId)
  );
  const selectedFloors = new Set(
    zones
      .filter((zone) => selected.has(normalizeId(zone.id)))
      .map((zone) => zone.floorId)
  );

  return (
    <section className="mt-5 border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Access Assignment</h3>
          <p className="mt-1 text-[11px] text-slate-500">
            Assign floor-wise tenant zones.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-cyan-200">
          <span className="border border-cyan-400/30 bg-cyan-400/10 px-2 py-1">
            {selectedBuildings.size} Buildings
          </span>
          <span className="border border-cyan-400/30 bg-cyan-400/10 px-2 py-1">
            {selectedFloors.size} Floors
          </span>
          <span className="border border-cyan-400/30 bg-cyan-400/10 px-2 py-1">
            {selected.size} Zones
          </span>
        </div>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search floor or zone"
        className="mt-4 h-10 w-full border border-white/10 bg-[#06184A] px-3 text-sm text-white outline-none focus:border-cyan-400"
      />

      {error && (
        <p className="mt-2 text-[11px] font-medium text-red-300">
          {error}
        </p>
      )}

      <div className="mt-4 max-h-[420px] overflow-y-auto border border-white/10 bg-[#06184A] p-3">
        {groupedBuildings.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-slate-500">
            No matching floors or zones.
          </p>
        ) : (
          <div className="space-y-4">
            {groupedBuildings.map((building) => (
              <section
                key={building.id}
                className="border border-white/10 bg-[#041237]"
              >
                <header className="border-b border-white/10 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                    {building.name}
                  </p>
                </header>

                <div className="space-y-3 p-3">
                  {building.floors.map((floor) => {
                    const floorZoneIds = floor.zones.map((zone) =>
                      normalizeId(zone.id)
                    );
                    const selectedCount = floorZoneIds.filter((zoneId) =>
                      selected.has(zoneId)
                    ).length;
                    const allSelected =
                      selectedCount > 0 &&
                      selectedCount === floorZoneIds.length;
                    const partiallySelected =
                      selectedCount > 0 && !allSelected;

                    return (
                      <section
                        key={floor.id}
                        className="border border-white/10 bg-white/[0.03] p-3"
                      >
                        <label className="flex items-center gap-3 text-xs font-semibold text-white">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(node) => {
                              if (node) {
                                node.indeterminate = partiallySelected;
                              }
                            }}
                            onChange={() => toggleFloor(floor.zones)}
                          />
                          <span>{floor.name}</span>
                          <span className="ml-auto text-[10px] font-medium text-slate-500">
                            {selectedCount}/{floorZoneIds.length} zones
                          </span>
                        </label>

                        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                          {floor.zones.map((zone) => (
                            <label
                              key={zone.id}
                              className={`flex min-h-10 cursor-pointer items-center gap-2 border px-2 py-2 text-xs transition ${
                                selected.has(normalizeId(zone.id))
                                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-100"
                                  : "border-white/10 bg-[#06184A] text-slate-300 hover:border-cyan-400/50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selected.has(normalizeId(zone.id))}
                                onChange={() => toggleZone(zone.id)}
                              />
                              <span className="min-w-0">
                                <span className="block truncate font-semibold">
                                  {zone.zoneName}
                                </span>
                                <span className="block text-[10px] text-slate-500">
                                  {zone.zoneLabel}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function UserFormModal({
  mode,
  currentAdmin,
  initialValue,
  onCancel,
  onSaved,
}) {
  const grantablePermissions = React.useMemo(
    () => getGrantableUserPermissions(currentAdmin),
    [currentAdmin]
  );
  const [form, setForm] = React.useState(() => initialValue);
  const [errors, setErrors] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const formOptions = getUserFormOptions(currentAdmin, form);

  React.useEffect(() => {
    setForm(initialValue);
    setErrors({});
    setMessage("");
    setIsSaving(false);
  }, [initialValue]);

  const updateField = (name, value) => {
    setErrors({});
    setMessage("");
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const updateScope = (field, values) => {
    setErrors({});
    setMessage("");
    const nextForm = { ...form, [field]: values };
    const pruned = getUserFormOptions(currentAdmin, nextForm).scope;
    setForm((previous) => ({ ...previous, [field]: values, ...pruned }));
  };

  const togglePermission = (permission) => {
    setErrors({});
    setMessage("");
    setForm((previous) => ({
      ...previous,
      permissions: previous.permissions.includes(permission)
        ? previous.permissions.filter((item) => item !== permission)
        : [...previous.permissions, permission],
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrors({});
    setMessage("");

    const result =
      mode === "edit"
        ? updateUser(currentAdmin, initialValue.id, form)
        : createUser(currentAdmin, form);

    if (!result.success) {
      setErrors(result.errors || {});
      setMessage(result.message || "Unable to save User.");
      setIsSaving(false);
      return;
    }

    onSaved(result.user);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 p-3 sm:p-4">
      <section className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden border border-cyan-400/30 bg-[#020B24] text-white shadow-2xl">
        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {mode === "edit" ? "Edit User" : "Add User"}
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            User Access Configuration
          </h2>
        </div>

        <form
          onSubmit={submit}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5"
        >
          {message && (
            <div className="mb-4 border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {message}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  error={errors.name}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  error={errors.email}
                />
              </div>
            </section>

            <section className="border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-semibold">Login Credentials</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField
                  label={
                    mode === "edit"
                      ? "New Temporary Password"
                      : "Temporary Password"
                  }
                  name="temporaryPassword"
                  type="password"
                  value={form.temporaryPassword}
                  onChange={updateField}
                  error={errors.temporaryPassword}
                />
                <label className="flex h-10 items-center gap-3 self-end border border-white/10 bg-[#06184A] px-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.mustChangePassword}
                    onChange={(event) =>
                      updateField(
                        "mustChangePassword",
                        event.target.checked
                      )
                    }
                  />
                  Must change password
                </label>
              </div>
              <label className="mt-4 flex items-center gap-3 border border-white/10 bg-[#06184A] px-3 py-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />
                Account active
              </label>
            </section>
          </div>

          <PermissionPicker
            grantablePermissions={grantablePermissions}
            selectedPermissions={form.permissions}
            onToggle={togglePermission}
            error={errors.permissions}
          />

          <FloorZoneAssignment
            zones={formOptions.zones}
            selectedZoneIds={form.assignedZoneIds}
            onChange={(values) => updateScope("assignedZoneIds", values)}
            error={errors.assignedZoneIds}
          />

          <div className="sticky bottom-0 mt-5 flex flex-col gap-3 border-t border-white/10 bg-[#020B24] py-4 sm:flex-row sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 w-full border border-white/15 px-4 text-sm font-semibold text-slate-300 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 w-full border border-cyan-400 bg-cyan-400 px-4 text-sm font-semibold text-[#020B24] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSaving ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DetailsModal({
  user,
  currentAdmin,
  onClose,
  onEdit,
  onResetPassword,
  onStatus,
  onDelete,
}) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <section className="flex max-h-[95dvh] w-full max-w-full flex-col overflow-x-hidden border border-cyan-400/30 bg-[#020B24] text-white shadow-2xl sm:max-h-[92dvh] sm:max-w-5xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              User Details
            </p>
            <h2 className="mt-1 break-words text-lg font-semibold sm:text-xl">{user.name}</h2>
            <p className="mt-1 break-all text-xs text-blue-200">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <SummaryCard title="Status" value={getStatusText(user)} />
            <SummaryCard
              title="Consumption"
              value={`${formatNumber(user.consumption)} kWh`}
            />
            <SummaryCard
              title="Charges"
              value={formatCurrency(user.charges)}
              accent
            />
            <SummaryCard
              title="Created"
              value={formatDate(user.createdAt)}
            />
            <SummaryCard
              title="Last Login"
              value={formatDate(user.lastLoginAt)}
            />
            <SummaryCard
              title="Password"
              value={
                user.mustChangePassword ? "Temporary" : "Configured"
              }
              sub={
                user.passwordResetAt
                  ? `Reset ${formatDate(user.passwordResetAt)}`
                  : "No reset recorded"
              }
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <section className="border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-semibold">Profile</h3>
              <dl className="mt-3 grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Role</dt>
                  <dd>{SYSTEM_ROLES.USER}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Created by</dt>
                  <dd>{currentAdmin.name || currentAdmin.adminName}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onResetPassword(user)}
                  className="border border-cyan-400/40 px-3 py-2 text-xs font-semibold text-cyan-300"
                >
                  Reset Password
                </button>
                {!isDeleted(user) && (
                  <button
                    type="button"
                    onClick={() => onStatus(user)}
                    className="border border-amber-400/40 px-3 py-2 text-xs font-semibold text-amber-300"
                  >
                    {user.isActive === false ? "Enable" : "Disable"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(user)}
                  className="border border-red-400/40 px-3 py-2 text-xs font-semibold text-red-300"
                >
                  Delete
                </button>
              </div>
            </section>

            <section className="border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-semibold">Assigned Scope</h3>
              <div className="mt-3 space-y-3 text-xs text-slate-300">
                {[
                  ["Clients", user.scopeLabels.clients],
                  ["Buildings", user.scopeLabels.buildings],
                  ["Blocks", user.scopeLabels.blocks],
                  ["Floors", user.scopeLabels.floors],
                  ["Zones", user.scopeLabels.zones],
                ].map(([label, values]) => (
                  <div key={label}>
                    <p className="text-slate-500">{label}</p>
                    <p className="mt-1">
                      {values.length ? values.join(", ") : "-"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-sm font-semibold">Permissions</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.permissions.map((permission) => (
                <span
                  key={permission}
                  className="border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] text-slate-300"
                >
                  {permissionLabels[permission] || permission}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function ConfirmDialog({ confirmation, onCancel }) {
  if (!confirmation) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <section className="max-h-[95dvh] w-full max-w-md overflow-y-auto border border-white/10 bg-[#020B24] p-5 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
          Confirm Action
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          {confirmation.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {confirmation.message}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="border border-white/10 px-4 py-2 text-sm text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmation.onConfirm}
            className="border border-amber-300 bg-amber-300 px-4 py-2 text-sm font-semibold text-[#020B24]"
          >
            Continue
          </button>
        </div>
      </section>
    </div>
  );
}

function PasswordDialog({ result, onClose }) {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <section className="max-h-[95dvh] w-full max-w-md overflow-y-auto border border-cyan-400/30 bg-[#020B24] p-5 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Password Reset Complete
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          Temporary password generated
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Show this temporary password once to the User. The previous password will no longer work.
        </p>
        <div className="mt-4 break-all border border-white/10 bg-[#06184A] px-4 py-3 font-mono text-sm text-cyan-200">
          {result.temporaryPassword}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-cyan-400 bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#020B24]"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  );
}

// export default function AdminDashboard() {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [users, setUsers] = React.useState([]);
//   const [summary, setSummary] = React.useState(() =>
//     getAdminDashboardSummary(currentUser)
//   );
//   const [formState, setFormState] = React.useState(null);
//   const [selectedUser, setSelectedUser] = React.useState(null);
//   const [confirmation, setConfirmation] = React.useState(null);
//   const [passwordResult, setPasswordResult] = React.useState(null);
//   const [showDeleted, setShowDeleted] = React.useState(true);
//   const [notice, setNotice] = React.useState("");

//   const currentAdmin = currentUser;

//   const refresh = React.useCallback(() => {
//     if (!currentAdmin) return;

//     setUsers(
//       getUsersForAdmin(currentAdmin.id, {
//         includeDeleted: showDeleted,
//       })
//     );
//     setSummary(getAdminDashboardSummary(currentAdmin));

//     if (userId) {
//       setSelectedUser(
//         getUserByIdForAdmin(currentAdmin.id, userId)
//       );
//     }
//   }, [currentAdmin, showDeleted, userId]);

//   React.useEffect(() => {
//     refresh();
//   }, [refresh]);

//   React.useEffect(() => {
//     if (!userId || !currentAdmin) return;

//     const routeUser = getUserByIdForAdmin(currentAdmin.id, userId);

//     if (!routeUser) {
//       navigate("/access-denied", { replace: true });
//       return;
//     }

//     setSelectedUser(routeUser);
//   }, [currentAdmin, navigate, userId]);

//   const can = (permission) =>
//     currentAdmin?.systemRole === SYSTEM_ROLES.ADMIN ||
//     currentAdmin?.permissions?.includes(permission);

//   const closeDetails = () => {
//     setSelectedUser(null);
//     if (userId) navigate("/admin/dashboard", { replace: true });
//   };

//   const openDetails = (user) => {
//     setSelectedUser(getUserByIdForAdmin(currentAdmin.id, user.id));
//     navigate(`/admin/users/${user.id}`);
//   };

//   const openAddUser = () => {
//     if (userId) {
//       navigate("/admin/dashboard", { replace: true });
//     }

//     setNotice("");
//     setPasswordResult(null);
//     setFormState({
//       mode: "create",
//       key: `create-${Date.now()}`,
//       value: createInitialUserForm(),
//     });
//     setSelectedUser(null);
//   };

//   const openEdit = (user) => {
//     setNotice("");
//     setPasswordResult(null);
//     setFormState({
//       mode: "edit",
//       key: `edit-${user.id}-${Date.now()}`,
//       value: createEditUserForm(user),
//     });
//   };

//   const closeUserModal = () => {
//     setSelectedUser(null);
//     setFormState(null);
//     setNotice("");
//     setPasswordResult(null);
//     if (userId) {
//       navigate("/admin/dashboard", { replace: true });
//     }
//   };

//   const runAction = (title, message, action) => {
//     setConfirmation({
//       title,
//       message,
//       onConfirm: () => {
//         action();
//         setConfirmation(null);
//         refresh();
//       },
//     });
//   };

//   const handleResetPassword = (user) => {
//     runAction(
//       "Reset User password",
//       `Generate a new temporary password for ${user.name}? The previous password will stop working.`,
//       () => {
//         const result = resetUserPassword(currentAdmin, user.id);
//         if (result.success) {
//           setPasswordResult(result);
//           setNotice("Temporary password generated.");
//         }
//       }
//     );
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/auth", { replace: true });
//   };

//   return (
//     <main className="min-h-screen bg-[#020B24] p-4 text-white sm:p-5 lg:p-6">
//       <div className="mx-auto max-w-[1800px]">
//         <header className="mb-5 border border-white/10 bg-white/[0.05] px-5 py-4">
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="min-w-0">
//               <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
//                 ARCOT IIoT · Admin Dashboard
//               </p>
//               <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
//                 User Access Management
//               </h1>
//               <p className="mt-1 text-xs text-slate-400">
//                 Create and manage Users within your assigned BMS scope.
//               </p>
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => navigate("/dashboard")}
//                 className="h-10 border border-cyan-400/40 px-4 text-sm font-semibold text-cyan-200"
//               >
//                 Dashboard
//               </button>
             
            
//               <div className="border border-white/10 bg-[#06184A] px-4 py-2">
//                 <p className="text-[9px] uppercase tracking-[0.13em] text-slate-500">
//                   Signed in as
//                 </p>
//                 <p className="mt-0.5 text-sm font-medium text-cyan-200">
//                   {currentAdmin?.name || currentAdmin?.adminName}
//                 </p>
//               </div>
//               {can(ADMIN_PERMISSIONS.USER_CREATE) && (
//                 <button
//                   type="button"
//                   onClick={openAddUser}
//                   className="h-10 border border-cyan-400 bg-cyan-400 px-4 text-sm font-semibold text-[#020B24]"
//                 >
//                   Add User
//                 </button>
//               )}
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="h-10 border border-red-400/40 px-4 text-sm font-semibold text-red-300"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         {notice && (
//           <div className="mb-5 border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
//             {notice}
//           </div>
//         )}

//         <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-9">
//           <SummaryCard title="Total Users" value={summary.totalUsers} />
//           <SummaryCard title="Active" value={summary.activeUsers} />
//           <SummaryCard title="Disabled" value={summary.disabledUsers} />
//           <SummaryCard title="Deleted" value={summary.deletedUsers} />
//           <SummaryCard title="Clients" value={summary.assignedClients} />
//           <SummaryCard title="Blocks" value={summary.assignedBlocks} />
//           <SummaryCard title="Floors" value={summary.assignedFloors} />
//           <SummaryCard
//             title="Consumption"
//             value={`${formatNumber(summary.scopedConsumption)} kWh`}
//           />
//           <SummaryCard
//             title="Charges"
//             value={formatCurrency(summary.scopedCharges)}
//             accent
//           />
//         </section>

//         <section className="border border-white/10 bg-white/[0.05]">
//           <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
//                 Users
//               </p>
//               <h2 className="mt-1 text-lg font-semibold">
//                 Assigned User Accounts
//               </h2>
//             </div>
//             <label className="flex items-center gap-2 text-xs text-slate-300">
//               <input
//                 type="checkbox"
//                 checked={showDeleted}
//                 onChange={(event) =>
//                   setShowDeleted(event.target.checked)
//                 }
//               />
//               Show deleted Users
//             </label>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-[1500px] w-full text-left text-xs">
//               <thead className="bg-white/[0.03] text-slate-400">
//                 <tr>
//                   {[
//                     "Name",
//                     "Email",
//                     "Status",
//                     "Client",
//                     "Building",
//                     "Block",
//                     "Floors",
//                     "Permissions",
//                     "Consumption",
//                     "Charges",
//                     "Created",
//                     "Last Login",
//                     "Actions",
//                   ].map((heading) => (
//                     <th key={heading} className="px-4 py-3 font-medium">
//                       {heading}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="border-t border-white/5 align-top"
//                   >
//                     <td className="px-4 py-3 font-medium text-white">
//                       {user.name}
//                     </td>
//                     <td className="px-4 py-3 text-blue-200">
//                       {user.email}
//                     </td>
//                     <td className="px-4 py-3">
//                       <StatusBadge user={user} />
//                     </td>
//                     <td className="px-4 py-3">
//                       {user.scopeLabels.clients[0] || "-"}
//                     </td>
//                     <td className="px-4 py-3">
//                       {user.scopeLabels.buildings[0] || "-"}
//                     </td>
//                     <td className="px-4 py-3">
//                       {user.scopeLabels.blocks[0] || "-"}
//                     </td>
//                     <td className="px-4 py-3">
//                       {user.assignedFloorIds.length}
//                     </td>
//                     <td className="px-4 py-3">
//                       {user.permissions.length}
//                     </td>
//                     <td className="px-4 py-3">
//                       {formatNumber(user.consumption)} kWh
//                     </td>
//                     <td className="px-4 py-3 text-cyan-300">
//                       {formatCurrency(user.charges)}
//                     </td>
//                     <td className="px-4 py-3">
//                       {formatDate(user.createdAt)}
//                     </td>
//                     <td className="px-4 py-3">
//                       {formatDate(user.lastLoginAt)}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex flex-wrap gap-2">
//                         {can(ADMIN_PERMISSIONS.USER_VIEW) && (
//                           <button
//                             type="button"
//                             onClick={() => openDetails(user)}
//                             className="border border-cyan-400/40 px-2 py-1 text-[11px] font-semibold text-cyan-300"
//                           >
//                             View Details
//                           </button>
//                         )}
//                         {!isDeleted(user) &&
//                           can(ADMIN_PERMISSIONS.USER_EDIT) && (
//                             <button
//                               type="button"
//                               onClick={() => openEdit(user)}
//                               className="border border-white/15 px-2 py-1 text-[11px] font-semibold text-slate-300"
//                             >
//                               Edit
//                             </button>
//                           )}
//                         {!isDeleted(user) &&
//                           can(
//                             ADMIN_PERMISSIONS.USER_ENABLE_DISABLE
//                           ) && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 runAction(
//                                   user.isActive === false
//                                     ? "Enable User"
//                                     : "Disable User",
//                                   `${user.isActive === false ? "Enable" : "Disable"} ${user.name}?`,
//                                   () => {
//                                     setUserStatus(
//                                       currentAdmin,
//                                       user.id,
//                                       user.isActive === false
//                                     );
//                                     setNotice("User status updated.");
//                                   }
//                                 )
//                               }
//                               className="border border-amber-400/40 px-2 py-1 text-[11px] font-semibold text-amber-300"
//                             >
//                               {user.isActive === false
//                                 ? "Enable"
//                                 : "Disable"}
//                             </button>
//                           )}
//                         {!isDeleted(user) &&
//                           can(
//                             ADMIN_PERMISSIONS.USER_PASSWORD_RESET
//                           ) && (
//                             <button
//                               type="button"
//                               onClick={() => handleResetPassword(user)}
//                               className="border border-cyan-400/40 px-2 py-1 text-[11px] font-semibold text-cyan-300"
//                             >
//                               Reset Password
//                             </button>
//                           )}
//                         {!isDeleted(user) ? (
//                           can(ADMIN_PERMISSIONS.USER_DELETE) && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 runAction(
//                                   "Delete User",
//                                   `Soft-delete ${user.name}? Assignments and history will be preserved.`,
//                                   () => {
//                                     softDeleteUser(currentAdmin, user.id);
//                                     setNotice("User soft-deleted.");
//                                   }
//                                 )
//                               }
//                               className="border border-red-400/40 px-2 py-1 text-[11px] font-semibold text-red-300"
//                             >
//                               Delete
//                             </button>
//                           )
//                         ) : (
//                           can(ADMIN_PERMISSIONS.USER_DELETE) && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 runAction(
//                                   "Restore User",
//                                   `Restore ${user.name}? The account will remain disabled until you enable it.`,
//                                   () => {
//                                     restoreUser(currentAdmin, user.id);
//                                     setNotice("User restored as disabled.");
//                                   }
//                                 )
//                               }
//                               className="border border-emerald-400/40 px-2 py-1 text-[11px] font-semibold text-emerald-300"
//                             >
//                               Restore
//                             </button>
//                           )
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {users.length === 0 && (
//             <p className="px-5 py-8 text-center text-sm text-slate-400">
//               No Users exist for this Admin yet.
//             </p>
//           )}
//         </section>
//       </div>

//       {formState && (
//         <UserFormModal
//           key={formState.key}
//           mode={formState.mode}
//           currentAdmin={currentAdmin}
//           initialValue={formState.value}
//           onCancel={closeUserModal}
//           onSaved={(user) => {
//             closeUserModal();
//             refresh();
//             setNotice(
//               formState.mode === "edit"
//                 ? "User updated successfully."
//                 : "User created successfully."
//             );
//             if (formState.mode === "edit") {
//               setSelectedUser(
//                 getUserByIdForAdmin(currentAdmin.id, user.id)
//               );
//             }
//           }}
//         />
//       )}

//       {selectedUser && (
//         <DetailsModal
//           user={selectedUser}
//           currentAdmin={currentAdmin}
//           onClose={closeDetails}
//           onEdit={openEdit}
//           onResetPassword={handleResetPassword}
//           onStatus={(user) =>
//             runAction(
//               user.isActive === false ? "Enable User" : "Disable User",
//               `${user.isActive === false ? "Enable" : "Disable"} ${user.name}?`,
//               () => {
//                 setUserStatus(
//                   currentAdmin,
//                   user.id,
//                   user.isActive === false
//                 );
//                 setNotice("User status updated.");
//               }
//             )
//           }
//           onDelete={(user) =>
//             runAction(
//               "Delete User",
//               `Soft-delete ${user.name}? Assignments and history will be preserved.`,
//               () => {
//                 softDeleteUser(currentAdmin, user.id);
//                 setNotice("User soft-deleted.");
//                 closeDetails();
//               }
//             )
//           }
//         />
//       )}

//       <ConfirmDialog
//         confirmation={confirmation}
//         onCancel={() => setConfirmation(null)}
//       />
//       <PasswordDialog
//         result={passwordResult}
//         onClose={() => {
//           setPasswordResult(null);
//           refresh();
//         }}
//       />
//     </main>
//   );
// }


export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [users, setUsers] = React.useState([]);
  const [summary, setSummary] = React.useState(() =>
    getAdminDashboardSummary(currentUser)
  );
  const [formState, setFormState] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [confirmation, setConfirmation] = React.useState(null);
  const [passwordResult, setPasswordResult] = React.useState(null);
  const [showDeleted, setShowDeleted] = React.useState(true);
  const [notice, setNotice] = React.useState("");

  const currentAdmin = currentUser;

  const refresh = React.useCallback(() => {
    if (!currentAdmin) return;

    setUsers(
      getUsersForAdmin(currentAdmin.id, {
        includeDeleted: showDeleted,
      })
    );

    setSummary(getAdminDashboardSummary(currentAdmin));

    if (userId) {
      setSelectedUser(
        getUserByIdForAdmin(currentAdmin.id, userId)
      );
    }
  }, [currentAdmin, showDeleted, userId]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    if (!userId || !currentAdmin) return;

    const routeUser = getUserByIdForAdmin(
      currentAdmin.id,
      userId
    );

    if (!routeUser) {
      navigate("/access-denied", {
        replace: true,
      });
      return;
    }

    setSelectedUser(routeUser);
  }, [currentAdmin, navigate, userId]);

  const can = (permission) =>
    currentAdmin?.systemRole === SYSTEM_ROLES.ADMIN ||
    currentAdmin?.permissions?.includes(permission);

  const closeDetails = () => {
    setSelectedUser(null);

    if (userId) {
      navigate("/admin/dashboard", {
        replace: true,
      });
    }
  };

  const openDetails = (user) => {
    const userDetails = getUserByIdForAdmin(
      currentAdmin.id,
      user.id
    );

    setSelectedUser(userDetails);
    navigate(`/admin/users/${user.id}`);
  };

  const openAddUser = () => {
    if (userId) {
      navigate("/admin/dashboard", {
        replace: true,
      });
    }

    setNotice("");
    setPasswordResult(null);
    setSelectedUser(null);

    setFormState({
      mode: "create",
      key: `create-${Date.now()}`,
      value: createInitialUserForm(),
    });
  };

  const openEdit = (user) => {
    setNotice("");
    setPasswordResult(null);

    setFormState({
      mode: "edit",
      key: `edit-${user.id}-${Date.now()}`,
      value: createEditUserForm(user),
    });
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setFormState(null);
    setNotice("");
    setPasswordResult(null);

    if (userId) {
      navigate("/admin/dashboard", {
        replace: true,
      });
    }
  };

  const runAction = (title, message, action) => {
    setConfirmation({
      title,
      message,
      onConfirm: () => {
        action();
        setConfirmation(null);
        refresh();
      },
    });
  };

  const handleResetPassword = (user) => {
    runAction(
      "Reset User password",
      `Generate a new temporary password for ${user.name}? The previous password will stop working.`,
      () => {
        const result = resetUserPassword(
          currentAdmin,
          user.id
        );

        if (result.success) {
          setPasswordResult(result);
          setNotice("Temporary password generated.");
        }
      }
    );
  };

  const handleLogout = () => {
    logout();

    navigate("/auth", {
      replace: true,
    });
  };

  const headerButtonBase =
    "flex h-10 w-full items-center justify-center whitespace-nowrap border px-3 text-xs font-semibold transition-colors duration-200 sm:w-auto sm:min-w-[132px] sm:px-4 sm:text-sm";

  const tableButtonBase =
    "flex h-8 min-w-[96px] items-center justify-center whitespace-nowrap border px-2 text-[10px] font-semibold transition-colors duration-200 sm:min-w-[106px] sm:px-3 sm:text-[11px]";

  const renderUserActions = (user) => (
    <div className="flex min-w-[220px] flex-wrap gap-2">
      {can(ADMIN_PERMISSIONS.USER_VIEW) && (
        <button
          type="button"
          onClick={() => openDetails(user)}
          className={`${tableButtonBase} border-cyan-400/40 text-cyan-300 hover:border-cyan-300 hover:bg-cyan-400/10`}
        >
          View Details
        </button>
      )}

      {!isDeleted(user) && can(ADMIN_PERMISSIONS.USER_EDIT) && (
        <button
          type="button"
          onClick={() => openEdit(user)}
          className={`${tableButtonBase} border-white/15 text-slate-300 hover:border-white/30 hover:bg-white/5 hover:text-white`}
        >
          Edit
        </button>
      )}

      {!isDeleted(user) &&
        can(ADMIN_PERMISSIONS.USER_ENABLE_DISABLE) && (
          <button
            type="button"
            onClick={() =>
              runAction(
                user.isActive === false ? "Enable User" : "Disable User",
                `${user.isActive === false ? "Enable" : "Disable"} ${user.name}?`,
                () => {
                  setUserStatus(
                    currentAdmin,
                    user.id,
                    user.isActive === false
                  );
                  setNotice("User status updated.");
                }
              )
            }
            className={`${tableButtonBase} border-amber-400/40 text-amber-300 hover:border-amber-300 hover:bg-amber-400/10`}
          >
            {user.isActive === false ? "Enable" : "Disable"}
          </button>
        )}

      {!isDeleted(user) &&
        can(ADMIN_PERMISSIONS.USER_PASSWORD_RESET) && (
          <button
            type="button"
            onClick={() => handleResetPassword(user)}
            className={`${tableButtonBase} border-cyan-400/40 text-cyan-300 hover:border-cyan-300 hover:bg-cyan-400/10`}
          >
            Reset Password
          </button>
        )}

      {!isDeleted(user)
        ? can(ADMIN_PERMISSIONS.USER_DELETE) && (
            <button
              type="button"
              onClick={() =>
                runAction(
                  "Delete User",
                  `Soft-delete ${user.name}? Assignments and history will be preserved.`,
                  () => {
                    softDeleteUser(currentAdmin, user.id);
                    setNotice("User soft-deleted.");
                  }
                )
              }
              className={`${tableButtonBase} border-red-400/40 text-red-300 hover:border-red-300 hover:bg-red-400/10`}
            >
              Delete
            </button>
          )
        : can(ADMIN_PERMISSIONS.USER_DELETE) && (
            <button
              type="button"
              onClick={() =>
                runAction(
                  "Restore User",
                  `Restore ${user.name}? The account will remain disabled until you enable it.`,
                  () => {
                    restoreUser(currentAdmin, user.id);
                    setNotice("User restored as disabled.");
                  }
                )
              }
              className={`${tableButtonBase} border-emerald-400/40 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-400/10`}
            >
              Restore
            </button>
          )}
    </div>
  );

  return (
    <main className="min-h-[100dvh] w-full overflow-x-hidden bg-[#020B24] p-3 text-white sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-[1800px]">
        <header className="mb-5 border border-white/10 bg-white/[0.05] px-3 py-4 sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                ARCOT IIoT · Admin Dashboard
              </p>

              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                User Access Management
              </h1>

              <p className="mt-1 text-xs text-slate-400">
                Create and manage Users within your assigned
                BMS scope.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center xl:w-auto xl:justify-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className={`${headerButtonBase} border-cyan-400/40 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-100`}
              >
                Dashboard
              </button>

              <div className="flex h-10 min-w-0 flex-col justify-center border border-white/10 bg-[#06184A] px-3 min-[380px]:col-span-2 sm:col-span-1 sm:min-w-[190px] sm:max-w-[240px] sm:px-4">
                <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-slate-500">
                  Signed in as
                </p>

                <p className="truncate text-sm font-medium text-cyan-200">
                  {currentAdmin?.name ||
                    currentAdmin?.adminName ||
                    "Administrator"}
                </p>
              </div>

              {can(ADMIN_PERMISSIONS.USER_CREATE) && (
                <button
                  type="button"
                  onClick={openAddUser}
                  className={`${headerButtonBase} border-cyan-400 bg-cyan-400 text-[#020B24] hover:border-cyan-300 hover:bg-cyan-300`}
                >
                  Add User
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className={`${headerButtonBase} border-red-400/40 text-red-300 hover:border-red-300 hover:bg-red-400/10 hover:text-red-200`}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {notice && (
          <div className="mb-5 border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        )}

        <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-9">
          <SummaryCard
            title="Total Users"
            value={summary.totalUsers}
          />

          <SummaryCard
            title="Active"
            value={summary.activeUsers}
          />

          <SummaryCard
            title="Disabled"
            value={summary.disabledUsers}
          />

          <SummaryCard
            title="Deleted"
            value={summary.deletedUsers}
          />

          <SummaryCard
            title="Clients"
            value={summary.assignedClients}
          />

          <SummaryCard
            title="Blocks"
            value={summary.assignedBlocks}
          />

          <SummaryCard
            title="Floors"
            value={summary.assignedFloors}
          />

          <SummaryCard
            title="Consumption"
            value={`${formatNumber(
              summary.scopedConsumption
            )} kWh`}
          />

          <SummaryCard
            title="Charges"
            value={formatCurrency(summary.scopedCharges)}
            accent
          />
        </section>

        <section className="border border-white/10 bg-white/[0.05]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Users
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Assigned User Accounts
              </h2>
            </div>

            <label className="flex min-h-10 items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(event) =>
                  setShowDeleted(event.target.checked)
                }
                className="h-4 w-4 accent-cyan-400"
              />

              <span>Show deleted Users</span>
            </label>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {users.length === 0 ? (
              <p className="border border-white/10 bg-[#06184A] px-4 py-8 text-center text-sm text-slate-400">
                No assigned user accounts found.
              </p>
            ) : (
              users.map((user, index) => (
                <article
                  key={user.id}
                  className="w-full border border-white/10 bg-[#06184A] p-4 text-xs text-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                        #{index + 1}
                      </p>
                      <h3 className="mt-1 break-words text-base font-semibold text-white">
                        {user.name || "—"}
                      </h3>
                      <p className="mt-1 break-all text-[11px] text-blue-200">
                        {user.email || "—"}
                      </p>
                    </div>
                    <StatusBadge user={user} />
                  </div>

                  <dl className="mt-4 grid grid-cols-1 gap-3">
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Assigned Building
                      </dt>
                      <dd className="mt-1">
                        <BadgeList values={user.scopeLabels?.buildings} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Assigned Wing
                      </dt>
                      <dd className="mt-1">
                        <BadgeList values={user.scopeLabels?.blocks} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Assigned Floor
                      </dt>
                      <dd className="mt-1">
                        <BadgeList values={user.scopeLabels?.floors} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Assigned Zone
                      </dt>
                      <dd className="mt-1">
                        <BadgeList values={user.scopeLabels?.zones} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Permissions
                      </dt>
                      <dd className="mt-1">
                        <PermissionBadgeList permissions={user.permissions} />
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Consumption
                      </p>
                      <p className="mt-1 font-semibold text-white">
                        {formatNumber(user.consumption)} kWh
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Charges
                      </p>
                      <p className="mt-1 font-semibold text-cyan-300">
                        {formatCurrency(user.charges)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Created
                      </p>
                      <p className="mt-1 font-semibold text-slate-200">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        Last Login
                      </p>
                      <p className="mt-1 font-semibold text-slate-200">
                        {formatDate(user.lastLoginAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">{renderUserActions(user)}</div>
                </article>
              ))
            )}
          </div>

          <div className="hidden w-full overflow-hidden md:block">
            <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1540px] border-collapse text-left text-xs">
              <thead className="bg-white/[0.06] text-slate-300">
                <tr>
                  <th className="w-[64px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    S.No
                  </th>

                  <th className="w-[150px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    User Name
                  </th>

                  <th className="w-[210px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Email
                  </th>

                  <th className="w-[110px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Status
                  </th>

                  <th className="w-[150px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Assigned Building
                  </th>

                  <th className="w-[150px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Assigned Wing
                  </th>

                  <th className="w-[150px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Assigned Floor
                  </th>

                  <th className="w-[180px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Assigned Zone
                  </th>

                  <th className="w-[190px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Permissions
                  </th>

                  <th className="w-[135px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Current Consumption
                  </th>

                  <th className="w-[135px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Consumption Charges
                  </th>

                  <th className="w-[140px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Created Date
                  </th>

                  <th className="w-[140px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Last Login
                  </th>

                  <th className="w-[250px] border-b border-white/10 px-3 py-3 font-semibold uppercase tracking-[0.08em]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={14}
                      className="px-4 py-10 text-center text-sm text-slate-400"
                    >
                      No assigned user accounts found.
                    </td>
                  </tr>
                ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="align-top transition-colors odd:bg-white/[0.015] hover:bg-cyan-400/[0.04]"
                  >
                    <td className="px-3 py-3 font-semibold text-slate-400">
                      {index + 1}
                    </td>

                    <td className="px-3 py-3 font-medium text-white">
                      <p className="truncate" title={user.name}>
                        {user.name || "—"}
                      </p>
                    </td>

                    <td className="px-3 py-3 text-blue-200">
                      <p className="truncate" title={user.email}>
                        {user.email || "—"}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <StatusBadge user={user} />
                    </td>

                    <td className="px-3 py-3">
                      <BadgeList values={user.scopeLabels?.buildings} />
                    </td>

                    <td className="px-3 py-3">
                      <BadgeList values={user.scopeLabels?.blocks} />
                    </td>

                    <td className="px-3 py-3">
                      <BadgeList values={user.scopeLabels?.floors} />
                    </td>

                    <td className="px-3 py-3">
                      <BadgeList values={user.scopeLabels?.zones} />
                    </td>

                    <td className="px-3 py-3">
                      <PermissionBadgeList permissions={user.permissions} />
                    </td>

                    <td className="px-3 py-3 font-semibold text-slate-200">
                      {formatNumber(user.consumption)} kWh
                    </td>

                    <td className="px-3 py-3 font-semibold text-cyan-300">
                      {formatCurrency(user.charges)}
                    </td>

                    <td className="px-3 py-3 text-slate-300">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-3 py-3 text-slate-300">
                      {formatDate(user.lastLoginAt)}
                    </td>

                    <td className="px-3 py-3">
                      {renderUserActions(user)}
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </section>
      </div>

      {formState && (
        <UserFormModal
          key={formState.key}
          mode={formState.mode}
          currentAdmin={currentAdmin}
          initialValue={formState.value}
          onCancel={closeUserModal}
          onSaved={(user) => {
            const savedMode = formState.mode;

            closeUserModal();
            refresh();

            setNotice(
              savedMode === "edit"
                ? "User updated successfully."
                : "User created successfully."
            );

            if (savedMode === "edit") {
              setSelectedUser(
                getUserByIdForAdmin(
                  currentAdmin.id,
                  user.id
                )
              );
            }
          }}
        />
      )}

      {selectedUser && (
        <DetailsModal
          user={selectedUser}
          currentAdmin={currentAdmin}
          onClose={closeDetails}
          onEdit={openEdit}
          onResetPassword={handleResetPassword}
          onStatus={(user) =>
            runAction(
              user.isActive === false
                ? "Enable User"
                : "Disable User",
              `${
                user.isActive === false
                  ? "Enable"
                  : "Disable"
              } ${user.name}?`,
              () => {
                setUserStatus(
                  currentAdmin,
                  user.id,
                  user.isActive === false
                );

                setNotice("User status updated.");
              }
            )
          }
          onDelete={(user) =>
            runAction(
              "Delete User",
              `Soft-delete ${user.name}? Assignments and history will be preserved.`,
              () => {
                softDeleteUser(currentAdmin, user.id);
                setNotice("User soft-deleted.");
                closeDetails();
              }
            )
          }
        />
      )}

      <ConfirmDialog
        confirmation={confirmation}
        onCancel={() => setConfirmation(null)}
      />

      <PasswordDialog
        result={passwordResult}
        onClose={() => {
          setPasswordResult(null);
          refresh();
        }}
      />
    </main>
  );
}
