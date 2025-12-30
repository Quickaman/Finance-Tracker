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
      console.error(err);
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-[350px] space-y-4">
        <h2 className="text-2xl font-bold text-indigo-600">
          {mode === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        {mode === "Sign Up" && (
          <input
            type="text"
            placeholder="Full Name"
            required
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          required
          className="border p-2 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="border p-2 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white w-full py-2 rounded-md"
        >
          {mode === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {mode === "Sign Up" ? (
          <p className="text-sm">
            Already have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={() => setMode("Login")}
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Create a new account?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={() => setMode("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
