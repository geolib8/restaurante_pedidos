"use client";
import { useState } from "react";

export default function Home() {
    const [order, setOrder] = useState<{
    items: string[];
    tipo: string;
    direccion: string;
    telefono: string;
    hora: string;
  }>({
    items: [],
    tipo: "Entrega",
    direccion: "",
    telefono: "",
    hora: ""
  });

  const toggleItem = (item: string) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.includes(item)
        ? prev.items.filter(i => i !== item)
        : [...prev.items, item]
    }));
  };

  const handleSubmit = async () => {
    if (order.items.length === 0) {
      alert("Selecciona al menos un producto");
      return;
    }

    await fetch("/api/pedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    alert("Pedido enviado 🚀");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🍔 Menú</h1>

      <label>
        <input type="checkbox" onChange={() => toggleItem("Tacos al pastor")} />
        Tacos al pastor
      </label><br/>

      <label>
        <input type="checkbox" onChange={() => toggleItem("Quesadilla")} />
        Quesadilla
      </label><br/>

      <label>
        <input type="checkbox" onChange={() => toggleItem("Refresco")} />
        Refresco
      </label>

      <h2>Datos</h2>

      <select onChange={(e) => setOrder({...order, tipo: e.target.value})}>
        <option>Entrega</option>
        <option>Recoger</option>
      </select>

      <input placeholder="Dirección"
        onChange={(e) => setOrder({...order, direccion: e.target.value})}
      /><br/>

      <input placeholder="Teléfono"
        onChange={(e) => setOrder({...order, telefono: e.target.value})}
      /><br/>

      <input placeholder="Hora"
        onChange={(e) => setOrder({...order, hora: e.target.value})}
      /><br/>

      <button onClick={handleSubmit}>
        Hacer pedido
      </button>
    </div>
  );
}