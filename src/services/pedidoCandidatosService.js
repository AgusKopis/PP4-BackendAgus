import pool from "../config/db.js";
import { PedidoCandidatosSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types/index.ts').PedidoCandidatos} PedidoCandidatos */

/**
 * @returns {Promise<PedidoCandidatos[]>}
 */
export async function getAllPedidoCandidatos() {
  const rows = await pool.query("SELECT * FROM PedidoCandidatos");
  const candidatos = rows.map((row) => {
    const parsed = PedidoCandidatosSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error("El resultado no es un PedidoCandidatos válido", {
        cause: parsed.error,
      });
    }
    return parsed.data;
  });
  return candidatos;
}

/**
 * @param {number} id
 * @returns {Promise<PedidoCandidatos|null>}
 */
export async function getPedidoCandidatosById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM PedidoCandidatos WHERE id = ?",
    [id]
  );
  const candidato = { ...(rows[0] || null) };
  if (!candidato) return null;
  const parsed = PedidoCandidatosSchema.safeParse(candidato);
  if (!parsed.success) {
    throw new Error("El resultado no es un PedidoCandidatos válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/** 
 * @param {PedidoCandidatos} pedidoCandidato
*/
export async function createPedidoCandidatos(pedidoCandidato) {
  const { id, pedidoId, tecnicoId } = pedidoCandidato;

  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO PedidoCandidatos (id, pedidoId, tecnicoId) VALUES (?, ?, ?)",
    [id, pedidoId, tecnicoId]
  );

  const parsed = PedidoCandidatosSchema.safeParse({
    id: result.insertId,
    pedidoId,
    tecnicoId,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es un PedidoCandidatos válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/** 
 * @param {number} id
 * @param {PedidoCandidatos} pedidoCandidatos
 * @returns {Promise<[QueryResult, FieldPacket[]]>}
*/
export async function updatePedidoCandidatos(id, pedidoCandidatos) {
  const { pedidoId, tecnicoId } = pedidoCandidatos;
  const result = await pool.query(
    "UPDATE PedidoCandidatos SET pedidoId=?, tecnicoId=? WHERE id=?",
    [pedidoId, tecnicoId, id]
  );
  return result;
}

/**
 * @param {number} id
 * @returns {Promise<[QueryResult, FieldPacket[]]>}
 */
export async function deletePedidoCandidatos(id) {
  const result = await pool.query("DELETE FROM PedidoCandidatos WHERE id = ?", [id]);
  return result;
}
