import { getPool, sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json();
    const pool = await getPool();

    // 1. Verificar si el usuario ya existe
    const userCheck = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT id FROM Usuarios WHERE email = @email");

    if (userCheck.recordset.length > 0) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // 2. Insertar el nuevo usuario
    // NOTA: En un proyecto real, usa 'bcrypt' para encriptar la contraseña antes de este paso
    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query("INSERT INTO Usuarios (nombre, email, password) VALUES (@nombre, @email, @password)");

    return NextResponse.json({ message: "Usuario creado con éxito" }, { status: 201 });

  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}