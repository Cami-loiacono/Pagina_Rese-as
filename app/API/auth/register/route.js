import { getPool, sql } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // <--- 1. NUEVO: Importar bcrypt

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

    // 2. Encriptar la contraseña <--- 2. NUEVO
    // El "10" es el costo de procesamiento (salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insertar el nuevo usuario usando la contraseña encriptada
    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword) // <--- 3. NUEVO: Usar hashedPassword
      .query("INSERT INTO Usuarios (nombre, email, password) VALUES (@nombre, @email, @password)");

    return NextResponse.json({ message: "Usuario creado con éxito" }, { status: 201 });

  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}