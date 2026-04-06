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
  const [image, setImage] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);

  const [form, setForm] = useState({
    tipo: "Entrega",
    metodoPago: "Transferencia",
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

  const increase = (id: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSubmit = async () => {
    const cleanHora = form.tipo === "Recoger" ? form.hora : "";
    const cleanDireccion = form.tipo === "Entrega" ? form.direccion : "";
    const formData = new FormData();

    formData.append("tipo", form.tipo);
    formData.append("telefono", form.telefono);
    formData.append("hora", cleanHora);
    formData.append("direccion", cleanDireccion);
    formData.append("total", String(total));
    formData.append("metodoPago", form.metodoPago);

    formData.append(
      "items",
      JSON.stringify(
        cart.map(
          i => `${i.name} x${i.quantity} - $${i.price * i.quantity}`
        )
      )
    );

    if (form.metodoPago === "Transferencia" && image) {
      formData.append("image", image);
    }
    
    if (form.metodoPago === "Transferencia" && !image) {
      alert("Debes subir comprobante de pago");
      return;
    }
    if (!form.telefono || form.telefono.length < 10) {
      alert("Teléfono inválido");
      return;
    }

    if (form.tipo === "Entrega" && !form.direccion) {
      alert("Debes ingresar dirección");
      return;
    }

    if (form.tipo === "Recoger" && !form.hora) {
      alert("Debes ingresar hora de recogida");
      return;
    }
    const finalImage =
      form.metodoPago === "Transferencia" ? image : null;
    if (finalImage) {
      formData.append("image", finalImage);
    }
    await fetch("/api/menu", {
      method: "POST",
      body: formData
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
          {menu.map(item => {
            const cartItem = cart.find(i => i.id === item.id); // ✅ HERE

            return (
              <div
                key={item.id}
                className="bg-white border border-orange-100 rounded-2xl shadow-sm p-4 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-orange-600 font-bold text-lg">${item.price}</p>
                </div>
                
                {cartItem ? (
                  <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full">
                    
                    <button onClick={() => decrease(item.id)}>-</button>
                    
                    <span className="font-bold">{cartItem.quantity}</span>
                    
                    <button onClick={() => increase(item.id)}>+</button>
                    
                  </div>
                ) : (
                  <button
                    onClick={() => addItem(item)}
                    className="bg-orange-500 text-white w-10 h-10 rounded-full text-xl"
                  >
                    +
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* CART */}
        {cart.length > 0 && (
          <button
            onClick={() => setCart([])}
            className="text-sm text-red-500 mb-2"
          >
            Vaciar carrito
          </button>
        )}
        <div className="mt-6 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h2 className="font-bold text-lg mb-3">🛒 Tu pedido</h2>

          {cart.length === 0 && (
            <p className="text-gray-500 text-sm">Agrega productos</p>
          )}

          {cart.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-3 bg-gray-50 p-3 rounded-xl"
            >
              {/* LEFT */}
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price} c/u
                </p>
              </div>

              {/* CONTROLS */}
              <div className="flex items-center gap-2">
                
                <button
                  onClick={() => decrease(item.id)}
                  className="bg-red-400 w-8 h-8 rounded-lg"
                >
                  -
                </button>

                <span className="font-bold">{item.quantity}</span>

                <button
                  onClick={() => increase(item.id)}
                  className="bg-green-500 text-white w-8 h-8 rounded-lg"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 text-red-500 text-sm"
                >
                  🗑
                </button>
              </div>

              {/* PRICE */}
              <span className="font-bold text-gray-900">
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
            className="w-full p-3 border rounded-xl mb-3"
            onChange={(e) => {
              const metodoPago = e.target.value;

              setForm({
                ...form,
                metodoPago
              });

              // 🔥 CLEAR IMAGE if switching to efectivo
              if (metodoPago === "Efectivo") {
                setImage(null);
                setFileKey(prev => prev + 1);
              }
            }}
          >
            <option>Transferencia</option>
            <option>Efectivo</option>
          </select>
          {form.metodoPago === "Transferencia" && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl mb-3 text-sm text-blue-800">
              💳 Para confirmar tu pedido:<br/>
              1. Transfiere a la cuenta:<br/>
              <b>**** 1234 (tu cuenta aquí)</b><br/>
              2. Toma captura de pantalla<br/>
              3. Súbela abajo 👇
            </div>
          )}

          {form.metodoPago === "Efectivo" && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-xl mb-3 text-sm text-green-800">
              💵 Pago en efectivo<br/>
              Deja tu número y te contactaremos para confirmar el pedido.
            </div>
          )}
          <select
            className="w-full p-3 border rounded-xl mb-3"
            onChange={(e) => {
              const tipo = e.target.value;

              setForm(prev => ({
                ...prev,
                tipo,
                direccion: tipo === "Entrega" ? prev.direccion : "",
                hora: tipo === "Recoger" ? prev.hora : ""
              }));
            }}
          >
            <option>Entrega</option>
            <option>Recoger</option>
          </select>

          {form.tipo === "Entrega" && (
            <input
              placeholder="Dirección"
              className="w-full p-3 border rounded-xl mb-3"
              onChange={(e) => setForm({...form, direccion: e.target.value})}
            />
          )}

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
              type="time"
              className="w-full p-3 border rounded-xl mb-3"
              onChange={(e) => setForm({...form, hora: e.target.value})}
            />
          )}
          {form.metodoPago === "Transferencia" && (
            <input
              key={fileKey}
              type="file"
              accept="image/*"
              className="w-full p-3 border rounded-xl mb-3"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
            />
          )}
          <button
            disabled={cart.length === 0}
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl font-bold text-lg transition ${
              cart.length === 0
                ? "bg-gray-300"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            Hacer pedido 🚀
          </button>
        </div>
      </div>
    </div>
  );
}