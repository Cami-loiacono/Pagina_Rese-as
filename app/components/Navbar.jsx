"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    fetch("/API/auth/session")
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(!!data.user);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <nav style={{ display: "flex", gap: "20px", padding: "1rem", background: "#333", color: "#fff" }}>
      <Link href="/">Inicio</Link>

      {isLoggedIn ? (
        <>
          <Link href="/perfil">Mi Perfil</Link>
          <Link href="/dashboard">Panel</Link>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link href="/login">Iniciar Sesión</Link>
          <Link href="/registro">Registrarse</Link>
        </>
      )}
    </nav>
  );
}

function logout() {
  fetch("/api/auth/logout", { method: "POST" })
    .then(() => location.reload());
}