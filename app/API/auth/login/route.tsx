import { NextResponse } from "next/server";
import sql from "mssql";
import bcrypt from "bcryptjs";

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

    // Busco al usuao por el mail para afggaar el hash de la contraseña
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT id, email, password 
        FROM usuarios 
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = result.recordset[0];

    // ccompara la contra ingresada con el hash de la bd
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

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