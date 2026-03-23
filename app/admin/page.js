"use client";
import { useState } from "react";

export default function Admin() {
  const [pass, setPass] = useState("");

  const login = () => {
    if (pass === "1234") {
      localStorage.setItem("admin", "true");
      window.location.href = "/admin/dashboard";
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h1 className="text-xl font-bold mb-4 text-center">🔐 Admin</h1>

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPass(e.target.value)}
          className="border p-3 w-full mb-4 rounded-lg"
        />

        <button
          onClick={login}
          className="bg-orange-500 text-white w-full py-3 rounded-lg font-bold"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}