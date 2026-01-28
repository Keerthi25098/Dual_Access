import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function login() {
    // Validation
    if (username.trim() === "" || password.trim() === "") {
      alert("Username and Password are mandatory");
      return;
    }

    // Admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    // Admin login
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ username: "admin", role: "admin" })
      );
      navigate("/admin");
      return;
    }

    // Normal user login
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let foundUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!foundUser) {
      alert("Invalid username or password");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    navigate("/user");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />

          <button
            onClick={login}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          New user?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
