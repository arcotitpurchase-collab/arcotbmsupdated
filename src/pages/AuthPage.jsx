// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import loginBg from "../assets/login-bg.png";
// import prestigeLogo from "../assets/ser-removebg.png";

// export default function AuthPage() {
//   const navigate = useNavigate();

//   const [isRegister, setIsRegister] = useState(true);
//   const [form, setForm] = useState({
//     email: "",
//     username: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//     setSuccess("");
//   };

//   const resetForm = () => {
//     setForm({ email: "", username: "", password: "" });
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();

//     if (!form.email.includes("@")) {
//       setError("Email must contain @");
//       return;
//     }

//     if (!form.username.trim() || !form.password.trim()) {
//       setError("Username and password are required");
//       return;
//     }

//     localStorage.setItem(
//       "bmsUser",
//       JSON.stringify({
//         email: form.email.trim(),
//         username: form.username.trim(),
//         password: form.password.trim(),
//       })
//     );

//     localStorage.setItem("bmsRegistered", "true");

//     setSuccess("Registered successfully. Please login.");
//     setIsRegister(false);
//     resetForm();
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();

//     const savedUser = JSON.parse(localStorage.getItem("bmsUser"));

//     if (!savedUser) {
//       setError("Please register first");
//       return;
//     }

//     if (
//       form.username.trim() !== savedUser.username ||
//       form.password.trim() !== savedUser.password
//     ) {
//       setError("Invalid username or password");
//       return;
//     }

//     localStorage.setItem("bmsLoggedIn", "true");
//     navigate("/");
//   };

//   return (
//     <div
//       className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
//       style={{ backgroundImage: `url(${loginBg})` }}
//     >
//       <div className="absolute inset-0 bg-gradient-to-br from-[#081F5C]/80 via-black/65 to-[#004AAD]/45" />

//       <div className="relative z-10 w-full max-w-[560px] bg-[#081F5C]/90 border-2 border-[#004AAD] text-white shadow-2xl px-8 py-9 backdrop-blur-md">
//         {/* LOGOS */}
//         <div className="mb-8 flex items-center justify-center">
//           {/* ARCOT */}
//           <div className="pr-5">
//             <h1 className="text-[24px] font-500 tracking-[0.14em] uppercase leading-none">
//               ARCOT
//               <span className="text-[#67E8F9] ml-2">IIoT</span>
//             </h1>

//             <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-blue-300 font-medium">
//               Industrial Internet of Things
//             </p>
//           </div>

//           {/* LINE */}
//           <div className="h-[64px] w-px bg-[#004AAD]" />

//           {/* PRESTIGE */}
//           <div className="pl-5 flex items-center justify-center">
//             <img
//               src={prestigeLogo}
//               alt="Prestige Group"
//               className="h-[70px] w-auto object-contain"
//             />
//           </div>
//         </div>

//         <h2 className="text-center text-[25px] font-500 uppercase tracking-wide">
//           {isRegister ? "Register" : "Login"}
//         </h2>

//         <p className="mt-2 text-center text-sm text-blue-200">
//           {isRegister
//             ? "Create your dashboard access"
//             : "Login with your registered credentials"}
//         </p>

//         <form
//           onSubmit={isRegister ? handleRegister : handleLogin}
//           className="mt-6 space-y-4"
//         >
//           {isRegister && (
//             <input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Email"
//               autoComplete="off"
//               className="h-11 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none placeholder:text-blue-300 focus:border-cyan-400"
//             />
//           )}

//           <input
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             placeholder="Username"
//             autoComplete="off"
//             className="h-11 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none placeholder:text-blue-300 focus:border-cyan-400"
//           />

//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             autoComplete="new-password"
//             className="h-11 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none placeholder:text-blue-300 focus:border-cyan-400"
//           />

//           {error && <p className="text-sm font-bold text-red-400">{error}</p>}

//           {success && (
//             <p className="text-sm font-400 text-emerald-400">{success}</p>
//           )}

//           <button
//             type="submit"
//             className="h-11 w-full bg-[#004AAD] border border-cyan-400 text-white font-600 uppercase tracking-[0.1em] hover:bg-[#0058d6]"
//           >
//             {isRegister ? "Register" : "Login"}
//           </button>
//         </form>

//         <button
//           type="button"
//           onClick={() => {
//             setIsRegister(!isRegister);
//             setError("");
//             setSuccess("");
//             resetForm();
//           }}
//           className="mt-5 block w-full text-center text-sm font-500 text-cyan-300 hover:text-white"
//         >
//           {isRegister ? "Already registered? Login" : "Need account? Register"}
//         </button>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import loginBg from "../assets/login-bg3.png";
// import prestigeLogo from "../assets/ser-removebg.png";

// export default function AuthPage() {
//   const navigate = useNavigate();

//   const [isRegister, setIsRegister] = useState(true);
//   const [form, setForm] = useState({
//     email: "",
//     username: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//     setSuccess("");
//   };

//   const resetForm = () => {
//     setForm({ email: "", username: "", password: "" });
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();

//     if (!form.email.includes("@")) {
//       setError("Email must contain @");
//       return;
//     }

//     if (!form.username.trim() || !form.password.trim()) {
//       setError("Username and password are required");
//       return;
//     }

//     localStorage.setItem(
//       "bmsUser",
//       JSON.stringify({
//         email: form.email.trim(),
//         username: form.username.trim(),
//         password: form.password.trim(),
//       })
//     );

//     localStorage.setItem("bmsRegistered", "true");

//     setSuccess("Registered successfully. Please login.");
//     setIsRegister(false);
//     resetForm();
//   };

//  const handleLogin = (e) => {
//   e.preventDefault();

//   const username = form.username.trim();
//   const password = form.password.trim();

//   // ============================
//   // SUPER ADMIN LOGIN
//   // Username: vijay
//   // Password: 1234
//   // ============================
//   if (username === "vijay" && password === "1234") {
//     localStorage.setItem("bmsLoggedIn", "true");
//     localStorage.setItem("bmsRole", "superadmin");

//     navigate("/admin/superadmin");
//     return;
//   }

//   // ============================
//   // NORMAL USER LOGIN
//   // ============================
//   const savedUser = JSON.parse(localStorage.getItem("bmsUser"));

//   if (!savedUser) {
//     setError("Please register first");
//     return;
//   }

//   if (
//     username !== savedUser.username ||
//     password !== savedUser.password
//   ) {
//     setError("Invalid username or password");
//     return;
//   }

//   localStorage.setItem("bmsLoggedIn", "true");
//   localStorage.setItem("bmsRole", "admin");

//   navigate("/");
// };

//   return (
//   <div
//   className="relative min-h-screen flex items-center justify-end pr-6 pl-6 bg-cover bg-center bg-no-repeat"
//   style={{ backgroundImage: `url(${loginBg})` }}
// >
//   <div className="relative z-10 w-full max-w-[470px] bg-[#081F5C]/75 border border-cyan-400 text-white shadow-[0_0_30px_rgba(0,74,173,0.6)] px-7 py-7">
//     <div className="mb-6 flex items-center justify-center">
//       <div>
//         <h1 className="text-[26px] font-bold tracking-[0.13em] uppercase leading-none">
//           ARCOT
//           <span className="text-[#67E8F9] ml-2">IIoT</span>
//         </h1>

//         <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-blue-300">
//           Industrial Internet of Things
//         </p>
//       </div>

//       <div className="mx-4 h-[52px] w-px bg-[#004AAD]" />

//       <img
//         src={prestigeLogo}
//         alt="Prestige Group"
//         className="h-[60px] w-auto object-contain"
//       />
//     </div>

//     <h2 className="text-center text-[22px] font-semibold uppercase tracking-wide">
//       {isRegister ? "Register" : "Login"}
//     </h2>

//     <p className="mt-1 text-center text-xs text-blue-200">
//       {isRegister
//         ? "Create your dashboard access"
//         : "Login with your registered credentials"}
//     </p>

//     <form
//       onSubmit={isRegister ? handleRegister : handleLogin}
//       className="mt-5 space-y-3"
//     >
//       {isRegister && (
//         <input
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           placeholder="Email"
//           autoComplete="off"
//           className="h-10 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none placeholder:text-blue-300 focus:border-cyan-400"
//         />
//       )}

//       <input
//         name="username"
//         value={form.username}
//         onChange={handleChange}
//         placeholder="Username"
//         autoComplete="off"
//         className="h-10 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none placeholder:text-blue-300 focus:border-cyan-400"
//       />

//       <input
//         name="password"
//         type="password"
//         value={form.password}
//         onChange={handleChange}
//         placeholder="Password"
//         autoComplete="new-password"
//         className="h-10 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none placeholder:text-blue-300 focus:border-cyan-400"
//       />

//       {error && <p className="text-sm font-bold text-red-400">{error}</p>}

//       {success && (
//         <p className="text-sm font-normal text-emerald-400">{success}</p>
//       )}

//       <button
//         type="submit"
//         className="h-10 w-full bg-[#004AAD] border border-cyan-400 text-white font-semibold uppercase tracking-[0.1em] hover:bg-[#0058d6]"
//       >
//         {isRegister ? "Register" : "Login"}
//       </button>
//     </form>

//     <button
//       type="button"
//       onClick={() => {
//         setIsRegister(!isRegister);
//         setError("");
//         setSuccess("");
//         resetForm();
//       }}
//       className="mt-4 block w-full text-center text-sm font-medium text-cyan-300 hover:text-white"
//     >
//       {isRegister ? "Already registered? Login" : "Need account? Register"}
//     </button>
//   </div>
// </div>
//   );
// }






// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import loginBg from "../assets/login-bg3.png";
// import prestigeLogo from "../assets/ser-removebg.png";

// const AUTHORIZED_USERNAME = "Arcot";
// const AUTHORIZED_PASSWORD = "Arcot123";

// export default function AuthPage() {
//   const navigate = useNavigate();

//   const [isRegister, setIsRegister] = useState(true);

//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setForm((previousForm) => ({
//       ...previousForm,
//       [name]: value,
//     }));

//     setError("");
//     setSuccess("");
//   };

//   const resetForm = () => {
//     setForm({
//       username: "",
//       password: "",
//     });
//   };

//   const handleRegister = (event) => {
//     event.preventDefault();

//     const username = form.username.trim();
//     const password = form.password.trim();

//     if (!username || !password) {
//       setError("Username and password are required.");
//       return;
//     }

//     if (
//       username !== AUTHORIZED_USERNAME ||
//       password !== AUTHORIZED_PASSWORD
//     ) {
//       setError("Invalid authorized username or password.");
//       return;
//     }

//     localStorage.setItem(
//       "bmsUser",
//       JSON.stringify({
//         username: AUTHORIZED_USERNAME,
//       })
//     );

//     localStorage.setItem("bmsRegistered", "true");

//     setError("");
//     setSuccess("Registered successfully. Please login.");

//     setIsRegister(false);

//     setForm({
//       username: AUTHORIZED_USERNAME,
//       password: "",
//     });
//   };

//   const handleLogin = (event) => {
//     event.preventDefault();

//     const username = form.username.trim();
//     const password = form.password.trim();

//     if (!username || !password) {
//       setError("Username and password are required.");
//       return;
//     }

//     const isRegistered =
//       localStorage.getItem("bmsRegistered") === "true";

//     if (!isRegistered) {
//       setError("Please register first.");
//       setSuccess("");
//       setIsRegister(true);
//       resetForm();
//       return;
//     }

//     if (
//       username !== AUTHORIZED_USERNAME ||
//       password !== AUTHORIZED_PASSWORD
//     ) {
//       setError("Invalid username or password.");
//       setSuccess("");
//       return;
//     }

//     localStorage.setItem("bmsLoggedIn", "true");
//     localStorage.setItem("bmsRole", "admin");
//     localStorage.setItem("bmsUsername", AUTHORIZED_USERNAME);

//     navigate("/", { replace: true });
//   };

//   const switchAuthMode = () => {
//     setIsRegister((previousValue) => !previousValue);
//     setError("");
//     setSuccess("");
//     resetForm();
//   };

//   return (
//     <div
//       className="relative flex min-h-screen items-center justify-end bg-cover bg-center bg-no-repeat px-6"
//       style={{
//         backgroundImage: `url(${loginBg})`,
//       }}
//     >
//       <div className="absolute inset-0 bg-slate-950/10" />

//       <div className="relative z-10 w-full max-w-[470px] border border-cyan-400 bg-[#081F5C]/75 px-7 py-7 text-white shadow-[0_0_30px_rgba(0,74,173,0.6)] backdrop-blur-[2px]">
//         <div className="mb-6 flex items-center justify-center">
//           <div>
//             <h1 className="text-[26px] font-bold uppercase leading-none tracking-[0.13em]">
//               ARCOT
//               <span className="ml-2 text-[#67E8F9]">
//                 IIoT
//               </span>
//             </h1>

//             <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-blue-300">
//               Industrial Internet of Things
//             </p>
//           </div>

//           <div className="mx-4 h-[52px] w-px bg-[#004AAD]" />

//           <img
//             src={prestigeLogo}
//             alt="Prestige Group"
//             className="h-[60px] w-auto object-contain"
//           />
//         </div>

//         <h2 className="text-center text-[22px] font-semibold uppercase tracking-wide">
//           {isRegister ? "Register" : "Login"}
//         </h2>

//         <p className="mt-1 text-center text-xs text-blue-200">
//           {isRegister
//             ? "Register the authorized dashboard account"
//             : "Login with your registered credentials"}
//         </p>

//         <form
//           onSubmit={
//             isRegister ? handleRegister : handleLogin
//           }
//           className="mt-5 space-y-3"
//         >
//           <input
//             name="username"
//             type="text"
//             value={form.username}
//             onChange={handleChange}
//             placeholder="Username"
//             autoComplete="username"
//             spellCheck={false}
//             className="h-10 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-blue-300 focus:border-cyan-400"
//           />

//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//             autoComplete={
//               isRegister
//                 ? "new-password"
//                 : "current-password"
//             }
//             className="h-10 w-full border border-[#004AAD] bg-[#05143C] px-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-blue-300 focus:border-cyan-400"
//           />

//           {error && (
//             <div
//               role="alert"
//               className="border border-red-400/40 bg-red-500/10 px-3 py-2"
//             >
//               <p className="text-sm font-semibold text-red-300">
//                 {error}
//               </p>
//             </div>
//           )}

//           {success && (
//             <div
//               role="status"
//               className="border border-emerald-400/40 bg-emerald-500/10 px-3 py-2"
//             >
//               <p className="text-sm font-medium text-emerald-300">
//                 {success}
//               </p>
//             </div>
//           )}

//           <button
//             type="submit"
//             className="h-10 w-full border border-cyan-400 bg-[#004AAD] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#0058D6] focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
//           >
//             {isRegister ? "Register" : "Login"}
//           </button>
//         </form>

//         <button
//           type="button"
//           onClick={switchAuthMode}
//           className="mt-4 block w-full text-center text-sm font-medium text-cyan-300 transition-colors hover:text-white"
//         >
//           {isRegister
//             ? "Already registered? Login"
//             : "Register authorized account"}
//         </button>
//       </div>
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/login-bg3.png";
import prestigeLogo from "../assets/ser-removebg.png";
import { useAuth } from "../context/AuthContext";
import { getLandingRoute } from "../services/authService";

export default function AuthPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    isAuthenticated,
    isInitializing,
    login,
  } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isInitializing || !isAuthenticated || !currentUser) {
      return;
    }

    navigate(getLandingRoute(currentUser), {
      replace: true,
    });
  }, [
    currentUser,
    isAuthenticated,
    isInitializing,
    navigate,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = login(email, password);

      if (!result.success) {
        setError(
          result.message || "Invalid email or password."
        );
        return;
      }

      const targetRoute = result.landingRoute;

      if (!targetRoute) {
        setError(
          "This account does not have a valid system role."
        );

        return;
      }

      navigate(targetRoute, {
        replace: true,
      });
    } catch (loginError) {
      console.error("Login failed:", loginError);

      setError(
        "Unable to complete login. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="
        relative flex min-h-[100dvh] items-center justify-center
        overflow-x-hidden overflow-y-auto bg-cover bg-center bg-no-repeat px-3
        py-8 sm:px-8 lg:px-12
        lg:justify-end
      "
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      <div className="absolute inset-0 bg-slate-950/15" />

      <div
        className="
          absolute inset-0
          bg-[linear-gradient(90deg,rgba(2,11,36,0.08)_0%,rgba(2,11,36,0.12)_48%,rgba(2,11,36,0.48)_100%)]
        "
      />

      <section
        className="
          relative z-10 w-full max-w-[470px]
          border border-cyan-400/80 bg-[#081F5C]/80
          px-4 py-6 text-white sm:px-7 sm:py-7
          shadow-[0_20px_60px_rgba(0,20,70,0.55),0_0_30px_rgba(0,74,173,0.42)]
          backdrop-blur-[4px]
        "
        aria-labelledby="login-heading"
      >
        <div className="mb-6 flex flex-col items-center justify-center gap-4 min-[380px]:flex-row">
          <div>
            <h1
              className="
                text-[26px] font-bold uppercase leading-none
                tracking-[0.13em]
              "
            >
              ARCOT
              <span className="ml-2 text-[#67E8F9]">
                IIoT
              </span>
            </h1>

            <p
              className="
                mt-2 text-[8px] uppercase tracking-[0.25em]
                text-blue-300
              "
            >
              Industrial Internet of Things
            </p>
          </div>

          <div className="hidden h-[52px] w-px bg-[#2084E8] min-[380px]:block min-[380px]:mx-4" />

          <img
            src={prestigeLogo}
            alt="Prestige Group"
            className="h-[52px] w-auto object-contain sm:h-[60px]"
          />
        </div>

        <div className="text-center">
          <p
            className="
              text-[10px] font-semibold uppercase
              tracking-[0.22em] text-cyan-300
            "
          >
            Secure access portal
          </p>

          <h2
            id="login-heading"
            className="
              mt-2 text-[22px] font-semibold uppercase
              tracking-wide
            "
          >
            Account Login
          </h2>

          <p className="mt-1 text-xs leading-5 text-blue-200">
            Sign in using your Super Admin, Admin or User
            credentials.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="
                mb-1.5 block text-[11px] font-semibold
                uppercase tracking-[0.12em] text-blue-200
              "
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              spellCheck={false}
              disabled={isSubmitting}
              className="
                h-11 w-full border border-[#1F68BB]
                bg-[#05143C]/95 px-4 text-sm
                font-medium text-white outline-none
                transition-colors
                placeholder:font-normal placeholder:text-blue-300/70
                focus:border-cyan-400
                disabled:cursor-not-allowed disabled:opacity-60
              "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="
                mb-1.5 block text-[11px] font-semibold
                uppercase tracking-[0.12em] text-blue-200
              "
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isSubmitting}
              className="
                h-11 w-full border border-[#1F68BB]
                bg-[#05143C]/95 px-4 text-sm
                font-medium text-white outline-none
                transition-colors
                placeholder:font-normal placeholder:text-blue-300/70
                focus:border-cyan-400
                disabled:cursor-not-allowed disabled:opacity-60
              "
            />
          </div>

          {error && (
            <div
              role="alert"
              className="
                border border-red-400/45 bg-red-500/10
                px-3 py-2.5
              "
            >
              <p className="text-sm font-medium text-red-300">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex h-11 w-full items-center justify-center
              border border-cyan-300 bg-[#004AAD]
              px-4 text-sm font-semibold uppercase
              tracking-[0.1em] text-white
              transition-colors
              hover:bg-[#075BC8]
              focus:outline-none focus:ring-2
              focus:ring-cyan-300/60
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 border-t border-white/10 pt-4">
          <div
            className="
              grid grid-cols-3 gap-2 text-center
              text-[10px] uppercase tracking-[0.08em]
              text-blue-300
            "
          >
            <span className="border border-white/10 bg-white/[0.04] px-2 py-2">
              Super Admin
            </span>

            <span className="border border-white/10 bg-white/[0.04] px-2 py-2">
              Admin
            </span>

            <span className="border border-white/10 bg-white/[0.04] px-2 py-2">
              User
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] leading-4 text-blue-300/80">
          Access is controlled according to the assigned account
          role and permissions.
        </p>
      </section>
    </main>
  );
}
