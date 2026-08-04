import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ADMIN_PERMISSION_OPTIONS,
  ADMIN_PERMISSIONS,
  SYSTEM_ROLES,
} from "./data/permissionOptions";
import { useAuth } from "./context/AuthContext";
import {
  createAdmin,
  getAdminById,
  getAllAdmins,
  getSuperAdminDashboardSummary,
  getUsersCreatedByAdmin,
  isDeleted,
  resetAdminPassword,
  restoreAdmin,
  setAdminStatus,
  softDeleteAdmin,
  updateAdmin,
} from "./services/adminService";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  mustChangePassword: true,
  isActive: true,
  permissions: Object.values(ADMIN_PERMISSIONS),
};

const permissionGroups = [
  {
    title: "User Management",
    permissions: [
      ADMIN_PERMISSIONS.USER_CREATE,
      ADMIN_PERMISSIONS.USER_VIEW,
      ADMIN_PERMISSIONS.USER_EDIT,
      ADMIN_PERMISSIONS.USER_ENABLE_DISABLE,
      ADMIN_PERMISSIONS.USER_DELETE,
      ADMIN_PERMISSIONS.USER_PASSWORD_RESET,
    ],
  },
  {
    title: "Dashboards and Monitoring",
    permissions: [
      ADMIN_PERMISSIONS.DASHBOARD_VIEW,
      ADMIN_PERMISSIONS.LIVE_MONITORING_VIEW,
      ADMIN_PERMISSIONS.ANALYTICS_VIEW,
      ADMIN_PERMISSIONS.CONSUMPTION_VIEW,
      ADMIN_PERMISSIONS.CHARGES_VIEW,
    ],
  },
  {
    title: "Operations",
    permissions: [
      ADMIN_PERMISSIONS.DATA_DOWNLOAD,
      ADMIN_PERMISSIONS.ALERTS_VIEW,
      ADMIN_PERMISSIONS.DEVICE_CONTROL,
    ],
  },
];

const permissionLabels = Object.fromEntries(
  ADMIN_PERMISSION_OPTIONS.map((permission) => [
    permission.id,
    permission.label,
  ])
);

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

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getAdminStatus = (admin) => {
  if (isDeleted(admin)) return "Deleted";
  return admin.isActive === false ? "Disabled" : "Active";
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

function StatusBadge({ admin }) {
  const status = getAdminStatus(admin);
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

function TextField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  disabled = false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </span>
      <input
        name={name}
        value={value}
        type={type}
        disabled={disabled}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-10 w-full border border-white/10 bg-[#06184A] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {error && (
        <p className="mt-1 text-[11px] font-medium text-red-300">
          {error}
        </p>
      )}
    </label>
  );
}

function AdminFormModal({
  mode,
  initialValue,
  onCancel,
  onSaved,
}) {
  const [form, setForm] = React.useState(() => ({
    ...emptyForm,
    ...initialValue,
    password: "",
    confirmPassword: "",
  }));
  const [errors, setErrors] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const updateField = (name, value) => {
    setErrors({});
    setMessage("");
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const togglePermission = (permission) => {
    setErrors({});
    setMessage("");
    setForm((previous) => {
      const permissions = previous.permissions.includes(permission)
        ? previous.permissions.filter((item) => item !== permission)
        : [...previous.permissions, permission];

      return { ...previous, permissions };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setErrors({});

    const result =
      mode === "edit"
        ? updateAdmin(initialValue.id, form)
        : createAdmin(form);

    if (!result.success) {
      setErrors(result.errors || {});
      setMessage(result.message || "Unable to save Admin.");
      setIsSaving(false);
      return;
    }

    onSaved(result.admin);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/70 p-2 sm:items-center sm:p-4">
      <section className="flex max-h-[95dvh] w-full max-w-full flex-col overflow-x-hidden border border-cyan-400/30 bg-[#020B24] text-white shadow-2xl sm:max-w-5xl">
        <div className="border-b border-white/10 px-4 py-4 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {mode === "edit" ? "Edit Admin" : "Add Admin"}
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            Admin Account Configuration
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5"
        >
          {message && (
            <div className="mb-4 border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {message}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-semibold text-white">
                Basic Information
              </h3>
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
              <h3 className="text-sm font-semibold text-white">
                Login Credentials
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField
                  label={
                    mode === "edit"
                      ? "New Temporary Password"
                      : "Temporary Password"
                  }
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  error={errors.password}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField}
                  error={errors.confirmPassword}
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

          <section className="mt-5 border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-sm font-semibold text-white">
              Permissions
            </h3>
            {errors.permissions && (
              <p className="mt-2 text-[11px] font-medium text-red-300">
                {errors.permissions}
              </p>
            )}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {permissionGroups.map((group) => (
                <div
                  key={group.title}
                  className="border border-white/10 bg-[#06184A] p-3"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                    {group.title}
                  </p>
                  <div className="mt-3 space-y-2">
                    {group.permissions.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center gap-2 text-xs text-slate-300"
                      >
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                        />
                        {permissionLabels[permission]}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="sticky bottom-0 mt-5 grid gap-3 border-t border-white/10 bg-[#020B24] py-4 sm:flex sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 border border-white/15 px-4 text-sm font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 border border-cyan-400 bg-cyan-400 px-4 text-sm font-semibold text-[#020B24] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Admin"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DetailsModal({ admin, onClose, onResetPassword }) {
  const users = getUsersCreatedByAdmin(admin.id);

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/70 p-2 sm:items-center sm:p-4">
      <section className="flex max-h-[95dvh] w-full max-w-full flex-col overflow-x-hidden border border-cyan-400/30 bg-[#020B24] text-white shadow-2xl sm:max-w-5xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Admin Details
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {admin.name}
            </h2>
            <p className="mt-1 text-xs text-blue-200">
              <span className="break-all">{admin.email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <SummaryCard title="Role" value={SYSTEM_ROLES.ADMIN} />
            <SummaryCard title="Status" value={getAdminStatus(admin)} />
            <SummaryCard
              title="Users"
              value={admin.summary.userCount}
              sub={`${admin.summary.activeUserCount} active / ${admin.summary.disabledUserCount} disabled`}
            />
            <SummaryCard
              title="Consumption"
              value={`${formatNumber(admin.summary.consumptionKwh)} kWh`}
            />
            <SummaryCard
              title="Charges"
              value={formatCurrency(admin.summary.charges)}
              accent
            />
            <SummaryCard
              title="Password"
              value={
                admin.mustChangePassword
                  ? "Temporary"
                  : "Configured"
              }
              sub={
                admin.passwordResetAt
                  ? `Reset ${formatDate(admin.passwordResetAt)}`
                  : "No reset recorded"
              }
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <section className="border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-semibold">Profile</h3>
              <dl className="mt-3 grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Created</dt>
                  <dd>{formatDate(admin.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Last login</dt>
                  <dd>{formatDate(admin.lastLoginAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Created by</dt>
                  <dd>{admin.createdBy || "-"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Phone</dt>
                  <dd>{admin.phone || "-"}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => onResetPassword(admin)}
                className="mt-4 border border-cyan-400/40 px-3 py-2 text-xs font-semibold text-cyan-300"
              >
                Reset Password
              </button>
            </section>

            <section className="border border-white/10 bg-white/[0.04] p-4">
              <h3 className="text-sm font-semibold">Access Scope</h3>
              <div className="mt-3 space-y-3 text-xs text-slate-300">
                {[
                  ["Project", "Full Project Access"],
                  ["Buildings", "All Buildings"],
                  ["Floors", "All Floors"],
                  ["Zones", "All Zones"],
                  ["Systems", "All Systems"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-slate-500">{label}</p>
                    <p className="mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-5 border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-sm font-semibold">Permissions</h3>
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {permissionGroups.map((group) => (
                <div
                  key={group.title}
                  className="border border-white/10 bg-[#06184A] p-3"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                    {group.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.permissions
                      .filter((permission) =>
                        admin.permissions.includes(permission)
                      )
                      .map((permission) => (
                        <span
                          key={permission}
                          className="border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] text-slate-300"
                        >
                          {permissionLabels[permission]}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 border border-white/10 bg-white/[0.04] p-4">
            <h3 className="text-sm font-semibold">
              Users Created
            </h3>
            {users.length === 0 ? (
              <p className="mt-4 text-xs text-slate-500">
                This Admin has not created any Users.
              </p>
            ) : (
              <>
              <div className="mt-4 space-y-3 lg:hidden">
                {users.map((user) => (
                  <article
                    key={user.id}
                    className="w-full border border-white/10 bg-[#06184A] p-3 text-xs text-slate-300"
                  >
                    <h4 className="break-words font-semibold text-white">
                      {user.name}
                    </h4>
                    <p className="mt-1 break-all text-blue-200">
                      {user.email}
                    </p>
                    <dl className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                      {[
                        [
                          "Status",
                          isDeleted(user)
                            ? "Deleted"
                            : user.isActive === false
                              ? "Disabled"
                              : "Active",
                        ],
                        ["Created", formatDate(user.createdAt)],
                        ["Last login", formatDate(user.lastLoginAt)],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                            {label}
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-200">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>

              <div className="mt-4 hidden w-full lg:block">
                <table className="min-w-[720px] w-full text-left text-xs">
                  <thead className="text-slate-500">
                    <tr>
                      {[
                        "Name",
                        "Email",
                        "Status",
                        "Created",
                        "Last login",
                      ].map((heading) => (
                        <th key={heading} className="px-3 py-2">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-white/5"
                      >
                        <td className="px-3 py-2">{user.name}</td>
                        <td className="px-3 py-2 text-blue-200">
                          {user.email}
                        </td>
                        <td className="px-3 py-2">
                          {isDeleted(user)
                            ? "Deleted"
                            : user.isActive === false
                              ? "Disabled"
                              : "Active"}
                        </td>
                        <td className="px-3 py-2">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-3 py-2">
                          {formatDate(user.lastLoginAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

function ConfirmDialog({ confirmation, onCancel }) {
  if (!confirmation) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-black/70 p-2 sm:items-center sm:p-4">
      <section className="w-full max-w-md border border-white/10 bg-[#020B24] p-5 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
          Confirm Action
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          {confirmation.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {confirmation.message}
        </p>
        <div className="mt-5 grid gap-3 sm:flex sm:justify-end">
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
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-black/70 p-2 sm:items-center sm:p-4">
      <section className="w-full max-w-md border border-cyan-400/30 bg-[#020B24] p-5 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Password Reset Complete
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          Temporary password generated
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Show this temporary password once to the Admin. The stored session never includes passwords.
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

export default function SuperAdmin() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [admins, setAdmins] = React.useState(() => getAllAdmins());
  const [summary, setSummary] = React.useState(() =>
    getSuperAdminDashboardSummary()
  );
  const [formState, setFormState] = React.useState(null);
  const [selectedAdmin, setSelectedAdmin] = React.useState(null);
  const [confirmation, setConfirmation] = React.useState(null);
  const [passwordResult, setPasswordResult] = React.useState(null);
  const [showDeleted, setShowDeleted] = React.useState(true);
  const [notice, setNotice] = React.useState("");

  const refresh = React.useCallback(() => {
    setAdmins(getAllAdmins({ includeDeleted: showDeleted }));
    setSummary(getSuperAdminDashboardSummary());

    if (adminId) {
      setSelectedAdmin(getAdminById(adminId));
    }
  }, [adminId, showDeleted]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    if (adminId) {
      setSelectedAdmin(getAdminById(adminId));
    }
  }, [adminId]);

  const closeDetails = () => {
    setSelectedAdmin(null);
    if (adminId) navigate("/super-admin", { replace: true });
  };

  const openDetails = (admin) => {
    setSelectedAdmin(getAdminById(admin.id));
    navigate(`/super-admin/admins/${admin.id}`);
  };

  const openEdit = (admin) => {
    setFormState({
      mode: "edit",
      value: {
        ...admin,
        password: "",
        isActive: admin.isActive !== false && !isDeleted(admin),
      },
    });
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

  const handleResetPassword = (admin) => {
    runAction(
      "Reset Admin password",
      `Generate a new temporary password for ${admin.name}? The previous password will stop working.`,
      () => {
        const result = resetAdminPassword(admin.id);
        if (result.success) {
          setPasswordResult(result);
          setNotice("Temporary password generated.");
        }
      }
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#020B24] p-3 text-white sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1800px]">
        <header className="mb-5 border border-white/10 bg-white/[0.05] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                ARCOT IIoT · Super Admin
              </p>
              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Admin Management Control
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Manage Admin accounts, assigned BMS scope, permissions, consumption and charges.
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end">
              <div className="border border-white/10 bg-[#06184A] px-4 py-2 min-[380px]:col-span-2 sm:col-span-1">
                <p className="text-[9px] uppercase tracking-[0.13em] text-slate-500">
                  Signed in as
                </p>
                <p className="mt-0.5 text-sm font-medium text-cyan-200">
                  {currentUser?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormState({ mode: "create", value: emptyForm })
                }
                className="h-10 border border-cyan-400 bg-cyan-400 px-4 text-sm font-semibold text-[#020B24] sm:min-w-[116px]"
              >
                Add Admin
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="h-10 border border-red-400/40 px-4 text-sm font-semibold text-red-300 sm:min-w-[116px]"
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

        <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
          <SummaryCard title="Total Admins" value={summary.totalAdmins} />
          <SummaryCard title="Active" value={summary.activeAdmins} />
          <SummaryCard title="Disabled" value={summary.disabledAdmins} />
          <SummaryCard title="Deleted" value={summary.deletedAdmins} />
          <SummaryCard title="Total Users" value={summary.totalUsers} />
          <SummaryCard
            title="Consumption"
            value={`${formatNumber(summary.totalConsumption)} kWh`}
          />
          <SummaryCard
            title="Charges"
            value={formatCurrency(summary.totalCharges)}
            accent
          />
        </section>

        <section className="border border-white/10 bg-white/[0.05]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Admin Accounts
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                Access and Usage
              </h2>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(event) =>
                  setShowDeleted(event.target.checked)
                }
              />
              Show deleted Admins
            </label>
          </div>

          <div className="space-y-3 p-3 min-[1800px]:hidden">
            {admins.map((admin) => (
              <article
                key={admin.id}
                className="w-full border border-white/10 bg-[#06184A] p-4 text-xs text-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-white">
                      {admin.name}
                    </h3>
                    <p className="mt-1 break-all text-[11px] text-blue-200">
                      {admin.email}
                    </p>
                  </div>
                  <StatusBadge admin={admin} />
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                  {[
                    ["Users", admin.summary.userCount],
                    ["Access Scope", "Full Project"],
                    ["Permissions", admin.permissions.length],
                    [
                      "Consumption",
                      `${formatNumber(admin.summary.consumptionKwh)} kWh`,
                    ],
                    ["Charges", formatCurrency(admin.summary.charges)],
                    ["Created", formatDate(admin.createdAt)],
                    ["Last Login", formatDate(admin.lastLoginAt)],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                        {label}
                      </dt>
                      <dd className="mt-1 break-words font-semibold text-slate-200">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => openDetails(admin)}
                    className="flex h-10 w-full items-center justify-center border border-cyan-400/40 px-2 text-[11px] font-semibold text-cyan-300"
                  >
                    View Details
                  </button>
                  {!isDeleted(admin) && (
                    <button
                      type="button"
                      onClick={() => openEdit(admin)}
                      className="flex h-10 w-full items-center justify-center border border-white/15 px-2 text-[11px] font-semibold text-slate-300"
                    >
                      Edit
                    </button>
                  )}
                  {!isDeleted(admin) && (
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          admin.isActive === false
                            ? "Enable Admin"
                            : "Disable Admin",
                          `${admin.isActive === false ? "Enable" : "Disable"} ${admin.name}?`,
                          () => {
                            setAdminStatus(
                              admin.id,
                              admin.isActive === false
                            );
                            setNotice("Admin status updated.");
                          }
                        )
                      }
                      className="flex h-10 w-full items-center justify-center border border-amber-400/40 px-2 text-[11px] font-semibold text-amber-300"
                    >
                      {admin.isActive === false ? "Enable" : "Disable"}
                    </button>
                  )}
                  {!isDeleted(admin) && (
                    <button
                      type="button"
                      onClick={() => handleResetPassword(admin)}
                      className="flex h-10 w-full items-center justify-center border border-cyan-400/40 px-2 text-[11px] font-semibold text-cyan-300"
                    >
                      Reset Password
                    </button>
                  )}
                  {!isDeleted(admin) ? (
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          "Delete Admin",
                          `Soft-delete ${admin.name}? Users, assignments and history will be preserved.`,
                          () => {
                            softDeleteAdmin(admin.id);
                            setNotice("Admin soft-deleted.");
                          }
                        )
                      }
                      className="flex h-10 w-full items-center justify-center border border-red-400/40 px-2 text-[11px] font-semibold text-red-300"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        runAction(
                          "Restore Admin",
                          `Restore ${admin.name}? The account will remain disabled until you enable it.`,
                          () => {
                            restoreAdmin(admin.id);
                            setNotice("Admin restored as disabled.");
                          }
                        )
                      }
                      className="flex h-10 w-full items-center justify-center border border-emerald-400/40 px-2 text-[11px] font-semibold text-emerald-300"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden w-full min-[1800px]:block">
            <table className="min-w-[1500px] w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-slate-400">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Status",
                    "Users",
                    "Access Scope",
                    "Permissions",
                    "Consumption",
                    "Charges",
                    "Created",
                    "Last Login",
                    "Actions",
                  ].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-t border-white/5 align-top"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {admin.name}
                    </td>
                    <td className="px-4 py-3 text-blue-200">
                      {admin.email}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge admin={admin} />
                    </td>
                    <td className="px-4 py-3 text-cyan-300">
                      {admin.summary.userCount}
                    </td>
                    <td className="px-4 py-3">
                      Full Project
                    </td>
                    <td className="px-4 py-3">
                      {admin.permissions.length}
                    </td>
                    <td className="px-4 py-3">
                      {formatNumber(admin.summary.consumptionKwh)} kWh
                    </td>
                    <td className="px-4 py-3 text-cyan-300">
                      {formatCurrency(admin.summary.charges)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(admin.lastLoginAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-[240px] flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openDetails(admin)}
                          className="border border-cyan-400/40 px-2 py-1 text-[11px] font-semibold text-cyan-300"
                        >
                          View Details
                        </button>
                        {!isDeleted(admin) && (
                          <button
                            type="button"
                            onClick={() => openEdit(admin)}
                            className="border border-white/15 px-2 py-1 text-[11px] font-semibold text-slate-300"
                          >
                            Edit
                          </button>
                        )}
                        {!isDeleted(admin) && (
                          <button
                            type="button"
                            onClick={() =>
                              runAction(
                                admin.isActive === false
                                  ? "Enable Admin"
                                  : "Disable Admin",
                                `${admin.isActive === false ? "Enable" : "Disable"} ${admin.name}?`,
                                () => {
                                  setAdminStatus(
                                    admin.id,
                                    admin.isActive === false
                                  );
                                  setNotice("Admin status updated.");
                                }
                              )
                            }
                            className="border border-amber-400/40 px-2 py-1 text-[11px] font-semibold text-amber-300"
                          >
                            {admin.isActive === false ? "Enable" : "Disable"}
                          </button>
                        )}
                        {!isDeleted(admin) && (
                          <button
                            type="button"
                            onClick={() => handleResetPassword(admin)}
                            className="border border-cyan-400/40 px-2 py-1 text-[11px] font-semibold text-cyan-300"
                          >
                            Reset Password
                          </button>
                        )}
                        {!isDeleted(admin) ? (
                          <button
                            type="button"
                            onClick={() =>
                              runAction(
                                "Delete Admin",
                                `Soft-delete ${admin.name}? Users, assignments and history will be preserved.`,
                                () => {
                                  softDeleteAdmin(admin.id);
                                  setNotice("Admin soft-deleted.");
                                }
                              )
                            }
                            className="border border-red-400/40 px-2 py-1 text-[11px] font-semibold text-red-300"
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              runAction(
                                "Restore Admin",
                                `Restore ${admin.name}? The account will remain disabled until you enable it.`,
                                () => {
                                  restoreAdmin(admin.id);
                                  setNotice("Admin restored as disabled.");
                                }
                              )
                            }
                            className="border border-emerald-400/40 px-2 py-1 text-[11px] font-semibold text-emerald-300"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {admins.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              No Admin accounts match the current view.
            </p>
          )}
        </section>
      </div>

      {formState && (
        <AdminFormModal
          mode={formState.mode}
          initialValue={formState.value}
          onCancel={() => setFormState(null)}
          onSaved={(admin) => {
            setFormState(null);
            refresh();
            setNotice(
              formState.mode === "edit"
                ? "Admin updated successfully."
                : "Admin created successfully."
            );
            if (formState.mode === "edit") {
              setSelectedAdmin(getAdminById(admin.id));
            }
          }}
        />
      )}

      {selectedAdmin && (
        <DetailsModal
          admin={selectedAdmin}
          onClose={closeDetails}
          onResetPassword={handleResetPassword}
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
