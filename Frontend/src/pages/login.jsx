import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { publicRequest } from "../services/requestMethods";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (mode === "Sign Up") {
        const { data } = await publicRequest.post("/auth/register", {
          name,
          email,
          password,
        });
        setToken(data.token);
      } else {
        const { data } = await publicRequest.post("/auth/login", {
          email,
          password,
        });
        setToken(data.token);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-[380px] rounded-2xl p-8 shadow-xl space-y-6"
      >
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-600">
            {mode === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {mode === "Sign Up"
              ? "Track your expenses smarter"
              : "Login to manage your finances"}
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {mode === "Sign Up" && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            required
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ACTION */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition"
        >
          {mode === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* SWITCH MODE */}
        <p className="text-sm text-center text-zinc-500">
          {mode === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setMode("Login")}
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              New here?{" "}
              <span
                onClick={() => setMode("Sign Up")}
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
              >
                Create account
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
