import { NextResponse } from "next/server";
import sql from "mssql";

const config = {
  user: "sa",
  password: "Piolin3113",
  server: "localhost",
  database: "mi_app",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query(`
        SELECT id, email 
        FROM usuarios 
        WHERE email = @email AND password = @password
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = result.recordset[0];

    const response = NextResponse.json({ message: "Login OK" });

    response.cookies.set("session", String(user.id), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error del servidor" },
      { status: 500 }
    );
  }
}
