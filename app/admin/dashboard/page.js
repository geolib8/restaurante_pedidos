"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const loadMenu = () => {
    fetch("/api/menu")
      .then(res => res.json())
      .then(setMenu);
  };

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      window.location.href = "/admin";
    }
    loadMenu();
  }, []);

  const addItem = async () => {
    await fetch("/api/menu/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, price: Number(price) })
    });

    setName("");
    setPrice("");
    loadMenu();
  };

  const deleteItem = async (id) => {
    await fetch("/api/menu/delete", {
      method: "POST",
      body: JSON.stringify({ id })
    });

    loadMenu();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 Admin Menú</h1>

      {/* ADD */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 w-full mb-2 rounded-lg"
        />

        <input
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-3 w-full mb-2 rounded-lg"
        />

        <button
          onClick={addItem}
          className="bg-emerald-600 text-white w-full py-3 rounded-lg font-bold"
        >
          Agregar producto
        </button>
      </div>

      {/* LIST */}
      {menu.map(item => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-2"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-orange-600 font-bold">${item.price}</p>
          </div>

          <button
            onClick={() => deleteItem(item.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-lg"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}