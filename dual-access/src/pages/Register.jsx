import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function register() {
    if (username.trim() === "" || password.trim() === "") {
      alert("All fields are mandatory");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let exists = users.some((user) => user.username === username);

    if (exists) {
      alert("User already registered");
      return;
    }

    users.push({
      username: username,
      password: password,
      role: "user",
      credit: 5000,
    });

    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful");
    navigate("/"); // Redirect to login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          User Registration
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
            onClick={register}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
          >
            Register
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Already registered?{" "}
          <Link to="/" className="text-green-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
