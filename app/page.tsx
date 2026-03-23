"use client";
import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
};

type CartItem = MenuItem & { quantity: number };

export default function Home() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [form, setForm] = useState({
    tipo: "Entrega",
    direccion: "",
    telefono: "",
    hora: ""
  });

  useEffect(() => {
    fetch("/api/menu")
      .then(res => res.json())
      .then(setMenu);
  }, []);

  const addItem = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSubmit = async () => {
    await fetch("/api/menu", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        total,
        items: cart.map(
          i => `${i.name} x${i.quantity} - $${i.price * i.quantity}`
        )
      })
    });

    alert("Pedido enviado 🚀");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">

      {/* HEADER */}
      <div className="bg-orange-500 text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold">🌮 Taquería</h1>
        <p className="text-sm opacity-90">Ordena rápido y fácil</p>
      </div>

      <div className="p-4 max-w-2xl mx-auto">

        {/* MENU */}
        <h2 className="text-xl font-bold mb-3 text-gray-800">Menú</h2>

        <div className="grid gap-4">
          {menu.map(item => (
            <div
              key={item.id}
              className="bg-white border border-orange-100 rounded-2xl shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-orange-600 font-bold text-lg">${item.price}</p>
              </div>

              <button
                onClick={() => addItem(item)}
                className="bg-orange-500 text-white w-10 h-10 rounded-full text-xl flex items-center justify-center hover:scale-110 transition"
              >
                +
              </button>
            </div>
          ))}
        </div>

        {/* CART */}
        <div className="mt-6 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h2 className="font-bold text-lg mb-3">🛒 Tu pedido</h2>

          {cart.length === 0 && (
            <p className="text-gray-500 text-sm">Agrega productos</p>
          )}

          {cart.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span className="text-gray-700">
                {item.name} x{item.quantity}
              </span>
              <span className="font-semibold text-gray-900">
                ${item.price * item.quantity}
              </span>
            </div>
          ))}

          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span className="text-orange-600">${total}</span>
          </div>
        </div>

        {/* FORM */}
        <div className="mt-6 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h2 className="font-bold text-lg mb-3">Datos</h2>

          <select
            className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setForm({...form, tipo: e.target.value})}
          >
            <option>Entrega</option>
            <option>Recoger</option>
          </select>

          <input
            placeholder="Dirección"
            className="w-full p-3 border rounded-xl mb-3"
            onChange={(e) => setForm({...form, direccion: e.target.value})}
          />

          {/* PHONE VALIDATION */}
          <input
            placeholder="Teléfono (10 dígitos)"
            className="w-full p-3 border rounded-xl mb-3"
            maxLength={10}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setForm({...form, telefono: onlyNumbers});
            }}
          />

          {/* SHOW ONLY IF RECOGER */}
          {form.tipo === "Recoger" && (
            <input
              placeholder="Hora (ej. 8:30pm)"
              className="w-full p-3 border rounded-xl mb-3"
              onChange={(e) => setForm({...form, hora: e.target.value})}
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-700 transition"
          >
            Hacer pedido 🚀
          </button>
        </div>
      </div>
    </div>
  );
}