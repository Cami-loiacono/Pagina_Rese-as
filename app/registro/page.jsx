"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Sin anotación de tipo para evitar el error

    const res = await fetch("/API/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      router.push("/Login");
    } else {
      const data = await res.json();
      alert(data.error || "Error al registrarse");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
      <h2>Crear Cuenta</h2>
      <input 
        type="text" 
        placeholder="Nombre completo" 
        onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
        required 
      />
      <input 
        type="email" 
        placeholder="Correo electrónico" 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
        required 
      />
      <input 
        type="password" 
        placeholder="Contraseña" 
        onChange={(e) => setFormData({...formData, password: e.target.value})} 
        required 
      />
      <button type="submit">Registrarse</button>
    </form>
  );
}