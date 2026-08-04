import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLandingRoute } from "../services/authService";

export default function AccessDenied() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(
      currentUser ? getLandingRoute(currentUser) : "/auth",
      { replace: true }
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <main className="flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-[#020B24] p-4 text-white sm:p-6">
      <section className="w-full max-w-lg border border-white/10 bg-white/[0.06] p-5 text-center sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-red-300">
          Access restricted
        </p>

        <h1 className="mt-3 text-lg font-semibold sm:text-2xl">
          You do not have permission to open this page
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          This page is not available for your current account role or assigned permissions.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:justify-center">
          <button
            type="button"
            onClick={handleGoBack}
            className="h-10 border border-cyan-400 bg-cyan-400 px-4 text-sm font-semibold text-[#020B24]"
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="h-10 border border-red-400/40 px-4 text-sm font-semibold text-red-300"
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
