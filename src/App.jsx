import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import AccessDenied from "./components/AccessDenied";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  SYSTEM_ROLES,
  USER_PERMISSIONS,
} from "./data/permissionOptions";
import { useAuth } from "./context/AuthContext";
import { getLandingRoute } from "./services/authService";
import SuperAdmin from "./SuperAdmin";
import AuthPage from "./pages/AuthPage";
import BuildingOverview from "./pages/BuildingOverview";
import ClientOverview from "./pages/ClientOverview";
import FloorOverview from "./pages/FloorOverview";
import MainOverview from "./pages/MainOverview";
import OverviewPage from "./pages/OverviewPage";

function DefaultRoute() {
  const {
    currentUser,
    isAuthenticated,
    isInitializing,
  } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Navigate
      to={getLandingRoute(currentUser)}
      replace
    />
  );
}

function NotFoundPage() {
  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-[#020B24] p-4 text-white sm:p-6">
      <section className="w-full max-w-lg border border-white/10 bg-white/[0.06] p-5 text-center sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">
          404 error
        </p>

        <h1 className="mt-3 text-2xl font-semibold">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          The requested application page does not exist.
        </p>

        <a
          href="/"
          className="mt-6 inline-block border border-cyan-400 bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#020B24]"
        >
          Return to Application
        </a>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<DefaultRoute />} />

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute
              allowedRoles={[SYSTEM_ROLES.SUPER_ADMIN]}
            >
              <SuperAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/admins/:adminId"
          element={
            <ProtectedRoute
              allowedRoles={[SYSTEM_ROLES.SUPER_ADMIN]}
            >
              <SuperAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[SYSTEM_ROLES.ADMIN]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="/admin/users/:userId"
          element={
            <ProtectedRoute
              allowedRoles={[SYSTEM_ROLES.ADMIN]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                SYSTEM_ROLES.SUPER_ADMIN,
                SYSTEM_ROLES.ADMIN,
                SYSTEM_ROLES.USER,
              ]}
            >
              <MainOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/building/:buildingId"
          element={
            <ProtectedRoute
              allowedRoles={[
                SYSTEM_ROLES.SUPER_ADMIN,
                SYSTEM_ROLES.ADMIN,
                SYSTEM_ROLES.USER,
              ]}
              requiredPermission={
                USER_PERMISSIONS.DASHBOARD_VIEW
              }
            >
              <BuildingOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/building/:buildingId/floor/:floorId"
          element={
            <ProtectedRoute
              allowedRoles={[
                SYSTEM_ROLES.SUPER_ADMIN,
                SYSTEM_ROLES.ADMIN,
                SYSTEM_ROLES.USER,
              ]}
              requiredPermission={
                USER_PERMISSIONS.DASHBOARD_VIEW
              }
            >
              <FloorOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/building/:buildingId/floor/:floorId/client/:clientId"
          element={
            <ProtectedRoute
              allowedRoles={[
                SYSTEM_ROLES.SUPER_ADMIN,
                SYSTEM_ROLES.ADMIN,
                SYSTEM_ROLES.USER,
              ]}
              requiredPermission={
                USER_PERMISSIONS.DASHBOARD_VIEW
              }
            >
              <ClientOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/overview"
          element={
            <ProtectedRoute
              allowedRoles={[
                SYSTEM_ROLES.SUPER_ADMIN,
                SYSTEM_ROLES.ADMIN,
                SYSTEM_ROLES.USER,
              ]}
            >
              <OverviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/access-denied"
          element={<AccessDenied />}
        />
        <Route
          path="/unauthorized"
          element={<Navigate to="/access-denied" replace />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
