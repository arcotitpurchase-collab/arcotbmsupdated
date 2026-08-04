import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-[#020B24] p-4 text-white sm:p-6">
      <section className="border border-white/10 bg-white/[0.06] px-6 py-5 text-center">
        <p className="text-sm font-semibold text-cyan-300">
          Restoring secure session...
        </p>
      </section>
    </main>
  );
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermission,
}) {
  const location = useLocation();
  const {
    isAuthenticated,
    isInitializing,
    hasRole,
    hasPermission,
  } = useAuth();

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/access-denied" replace />;
  }

  if (
    requiredPermission &&
    !hasPermission(requiredPermission)
  ) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
