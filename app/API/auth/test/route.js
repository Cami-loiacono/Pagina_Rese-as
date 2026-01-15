import { getPool, sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pool = await getPool(); 
    
    
    const result = await pool.request().query("SELECT TOP 10 * FROM Usuarios");

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json({ error: "Error al conectar con la base de datos" }, { status: 500 });
  }
}