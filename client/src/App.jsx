import React, { useEffect, useMemo, useState } from "react";
import ItemForm from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";
import { FaCartShopping } from "react-icons/fa6";

const initialFilters = { query: "", category: "All" };

const getBackendUrl = () => {
  const { hostname } = window.location;
  if (
    hostname ===
    "shoping-cart-list-aj5wfxpfi-sandys-projects-e9cf1f4a.vercel.app"
  ) {
    return "https://shoping-cart-list.onrender.com";
  }
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000";
  }
  return "https://shoping-cart-list.onrender.com";
};

const backendUrl = getBackendUrl();

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/items`);
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data);
      setError("");
    } catch (err) {
      setError(err.message || "Error loading items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function addItem(payload) {
    try {
      const res = await fetch(`${backendUrl}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add item");
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
    } catch (err) {
      alert(err.message || "Error adding item");
    }
  }

  async function updateItem(id, payload) {
    try {
      const res = await fetch(`${backendUrl}/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setEditing(null);
    } catch (err) {
      alert(err.message || "Error updating item");
    }
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message || "Error deleting item");
    }
  }

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    for (const i of items) set.add(i.category || "General");
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    const q = filters.query.toLowerCase();
    const cat = filters.category;
    return items.filter((i) => {
      const matchesQuery = [i.name, i.category, i.note].some((v) =>
        (v || "").toLowerCase().includes(q)
      );
      const matchesCat = cat === "All" || i.category === cat;
      return matchesQuery && matchesCat;
    });
  }, [items, filters]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <h1 className="text-5xl font-bold text-gray-800">
              Shopping Cart List
            </h1>
            <FaCartShopping className="text-5xl text-amber-600 mt-3 animate-bounce" />
          </div>
          <p className="text-lg text-gray-500 mt-2">
            Organize your shopping list effortlessly.
          </p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Add New Item
          </h2>
          <ItemForm onSubmit={addItem} />
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-2xl font-semibold text-gray-700">Items</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={filters.query}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, query: e.target.value }))
                }
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => setFilters(initialFilters)}
              >
                Reset
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center text-gray-500 py-10">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-3">Loading items...</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 py-4 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-xl">No items yet.</p>
              <p>Add your first item above!</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <ItemList
              items={filtered}
              onEdit={setEditing}
              onDelete={deleteItem}
            />
          )}
        </section>

        {editing && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setEditing(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Edit Item
                </h3>
                <ItemForm
                  initial={editing}
                  onSubmit={(payload) => updateItem(editing.id, payload)}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </div>
          </div>
        )}

        <footer className="text-center text-gray-400 mt-12">
          <p>Built with React + Express + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
