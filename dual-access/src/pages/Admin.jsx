import { useEffect, useState } from "react";


function Admin() {
  const [products, setProducts] = useState(
    JSON.parse(localStorage.getItem("products")) || []
  );
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );
  const [payments, setPayments] = useState(
    JSON.parse(localStorage.getItem("payments")) || []
  );
  const [activeSection, setActiveSection] = useState("products");

  // Ensure current user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.role !== "admin") {
      alert("You must be an admin to access this page.");
      window.location.href = "/";
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [products, users, payments]);

  // Products
  const addProduct = () => {
    const name = prompt("Product Name:");
    const price = prompt("Price:");
    const stock = prompt("Stock:");
    const image = prompt("Image URL:");

    if (!name || !price || !stock || !image) {
      alert("All fields required!");
      return;
    }

    setProducts([
      ...products,
      { name, price: Number(price), stock: Number(stock), image },
    ]);
  };

  const editProduct = (index) => {
    const product = products[index];
    const newName = prompt("New Product Name:", product.name);
    const newPrice = prompt("New Price:", product.price);
    const newStock = prompt("New Stock:", product.stock);
    const newImage = prompt("New Image URL:", product.image);

    if (!newName || !newPrice || !newStock || !newImage) {
      alert("All fields are required!");
      return;
    }

    const updatedProducts = [...products];
    updatedProducts[index] = {
      name: newName,
      price: Number(newPrice),
      stock: Number(newStock),
      image: newImage,
    };
    setProducts(updatedProducts);
  };

  const deleteProduct = (index) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
    }
  };

  // Customers
  const openCustomer = (index) => {
    const user = users[index];
    const userPayments = payments.filter((p) => p.username === user.username);

    const rows = userPayments
      .map(
        (p, i) => `<tr>
          <td>${i + 1}</td>
          <td>${p.product}</td>
          <td>₹${p.amount}</td>
        </tr>`
      )
      .join("");

    const html = `
      <h3>Customer Details</h3>
      <p><b>Username:</b> ${user.username}</p>
      <p><b>Remaining Credit:</b> ₹${user.credit}</p>

      <table class="border-collapse w-full text-left mt-4 border">
        <tr class="bg-green-500 text-white">
          <th class="p-2">#</th>
          <th class="p-2">Product</th>
          <th class="p-2">Amount</th>
        </tr>
        ${rows || `<tr><td colspan="3" class="p-2">No purchases</td></tr>`}
      </table>
    `;

    const win = window.open("", "", "width=500,height=400");
    win.document.write(html);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-green-100 shadow-md px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-900">Admin Dashboard</h2>
      </div>

      {/* Menu */}
      <div className="flex justify-center gap-4 bg-white shadow-md py-4 mt-4">
        <button
          onClick={() => setActiveSection("products")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeSection === "products"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-green-200"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveSection("customers")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeSection === "customers"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-green-200"
          }`}
        >
          Customers
        </button>
        <button
          onClick={() => setActiveSection("payments")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeSection === "payments"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-green-200"
          }`}
        >
          Payments
        </button>
      </div>

      {/* Sections */}
      <div className="p-6">
        {/* Products */}
        {activeSection === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Products</h3>
              <button
                onClick={addProduct}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
              >
                + Add New Product
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <div
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                  key={i}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-contain rounded-md mb-2"
                  />
                  <h4 className="font-semibold text-gray-800 mb-1">{p.name}</h4>
                  <p className="text-gray-600">Price: ₹{p.price}</p>
                  <p className="text-gray-600">Stock: {p.stock}</p>
                  <div className="flex gap-2 mt-2 w-full">
                    <button
                      onClick={() => editProduct(i)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(i)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers */}
        {activeSection === "customers" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Registered Users
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {users.map((u, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                  onClick={() => openCustomer(i)}
                >
                  <h4 className="font-semibold text-gray-800 mb-1">{u.username}</h4>
                  <p className="text-gray-600 mb-1">
                    Remaining Credit: ₹{u.credit}
                  </p>
                  <p className="text-green-500 font-medium">Click to view details</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments */}
        {activeSection === "payments" && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Payments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {payments.map((p, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                >
                  <h4 className="font-semibold text-gray-800 mb-1">{p.username}</h4>
                  <p className="text-gray-600 mb-1">Product: {p.product}</p>
                  <p className="text-gray-600">Paid: ₹{p.amount}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
