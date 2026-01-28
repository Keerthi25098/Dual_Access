import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // 🔐 Protect user page
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "user") {
      navigate("/");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  // Load data
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const storedPayments = JSON.parse(localStorage.getItem("payments")) || [];

    storedUsers.forEach((u) => {
      if (u.credit == null) u.credit = 5000;
    });

    setUsers(storedUsers);
    setProducts(storedProducts);
    setPayments(storedPayments);

    localStorage.setItem("users", JSON.stringify(storedUsers));
  }, []);

  // Sync storage
  useEffect(() => localStorage.setItem("users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("payments", JSON.stringify(payments)), [payments]);

  if (!currentUser) return null;
  const user = users.find((u) => u.username === currentUser.username);

  function addToCart(index) {
    setSelectedIndex(index);
  }

  function placeOrder() {
    if (selectedIndex === null) {
      alert("Please select a product");
      return;
    }
    setShowPayment(true);
  }

  function payNow() {
    const product = products[selectedIndex];

    if (user.credit < product.price) {
      alert("Insufficient credit");
      return;
    }

    const updatedUsers = users.map((u) =>
      u.username === user.username ? { ...u, credit: u.credit - product.price } : u
    );

    const updatedProducts = products.map((p, i) =>
      i === selectedIndex ? { ...p, stock: p.stock - 1 } : p
    );

    setUsers(updatedUsers);
    setProducts(updatedProducts);
    setPayments([...payments, { username: user.username, product: product.name, amount: product.price }]);

    alert("Payment Successful");

    setSelectedIndex(null);
    setShowPayment(false);
  }

  function logout() {
    localStorage.removeItem("currentUser");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-green-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        <button
          onClick={logout}
          className="bg-white text-green-500 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>

      {/* Credit */}
      <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Credit Balance</h3>
        <p className="text-2xl font-bold text-green-600">₹{user.credit}</p>
      </div>

      {/* Products */}
      <h3 className="text-xl font-bold text-gray-800 max-w-4xl mx-auto mt-10 mb-4 px-4">Available Products</h3>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {products.map(
          (p, i) =>
            p.stock > 0 && (
              <div
                key={i}
                className={`bg-white rounded-xl shadow-md p-4 flex flex-col items-center transition transform hover:-translate-y-1 hover:shadow-lg`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-contain rounded-lg mb-3"
                />
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{p.name}</h4>
                <p className="text-gray-600 mb-1">Price: ₹{p.price}</p>
                <p className="text-gray-600 mb-2">Stock: {p.stock}</p>
                <button
                  onClick={() => addToCart(i)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition"
                >
                  Add to Cart
                </button>
              </div>
            )
        )}
      </div>

      {/* Cart */}
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Selected Product</h3>
        {selectedIndex === null ? (
          <p className="text-gray-500">No product selected</p>
        ) : (
          <p className="text-gray-700 font-medium">
            <span className="font-bold">{products[selectedIndex].name}</span> – ₹
            {products[selectedIndex].price}
          </p>
        )}
        <button
          onClick={placeOrder}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
        >
          Place Order
        </button>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Make Payment</h3>
            <img
              src={products[selectedIndex].image}
              alt={products[selectedIndex].name}
              className="w-32 h-32 mx-auto object-contain mb-3"
            />
            <p className="text-gray-700 font-medium mb-1">{products[selectedIndex].name}</p>
            <p className="text-gray-700 mb-4">Price: ₹{products[selectedIndex].price}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={payNow}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Pay Now
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
