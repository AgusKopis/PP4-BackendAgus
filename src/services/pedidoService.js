import pool from "../config/db.js";
import { formatDateForMySQL } from "../helpers/formatDate.js";
import { PedidoSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types').UpdateResult} UpdateResult */
/** @typedef {import('../types').DeleteResult} DeleteResult */

/** @typedef {import('../types').Pedido} Pedido */

/**
 *
 * @returns {Promise<Pedido[]>}
 */
export async function getAllPedidos() {
  const [rows] = await pool.query("SELECT * FROM Pedido");
  const pedidos =
    Array.isArray(rows) &&
    rows.map((row) => {
      const parsed = PedidoSchema.safeParse(row);
      if (!parsed.success) {
        throw new Error("El resultado no es un Pedido válido", {
          cause: parsed.error,
        });
      }
      return parsed.data;
    });
  return pedidos;
}

/**
 * @param {number} id
 * @returns {Promise<Pedido|null>}
 */
export async function getPedidoById(id) {
  const [rows] = await pool.query("SELECT * FROM Pedido WHERE id = ?", [id]);
  const pedido = rows[0];
  if (!pedido) return null;
  const parsed = PedidoSchema.safeParse(pedido);
  if (!parsed.success) {
    throw new Error("El resultado no es un Pedido válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * @param {Pedido} pedido
 * @returns {Promise<Pedido>}
 */
export async function createPedido(pedido) {
  const {
    id,
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    calificacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  } = pedido;

  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Pedido (id, clienteId, tecnicoId, estado, areaId, requerimiento, calificacion, comentario, respuesta, fechaCreacion, fechaCierre, fechaCancelado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      clienteId,
      tecnicoId,
      estado,
      areaId,
      requerimiento,
      calificacion,
      comentario,
      respuesta,
      formatDateForMySQL(fechaCreacion),
      formatDateForMySQL(fechaCierre),
      formatDateForMySQL(fechaCancelado),
    ]
  );
  // Validar el pedido creado
  const parsed = PedidoSchema.safeParse({
    id: result.insertId,
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    calificacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  });
  if (!parsed.success) {
    console.log("Error al crear el pedido:", parsed.error);
    throw new Error("El resultado no es un Pedido válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/** 
 * @param {number} id
 * @param {Pedido} pedido
 * @returns {Promise<UpdateResult>}

*/
export async function updatePedido(id, pedido) {
  const {
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    calificacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  } = pedido;
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "UPDATE Pedido SET id=? clienteId=?, tecnicoId=?, estado=?, areaId=?, requerimiento=?, calificacion=?, comentario=?, respuesta=?, fechaCreacion=?, fechaCierre=?, fechaCancelado=? WHERE id=?",
    [
      clienteId,
      tecnicoId,
      estado,
      areaId,
      requerimiento,
      calificacion,
      comentario,
      respuesta,
      fechaCreacion,
      fechaCierre,
      fechaCancelado,
      id,
    ]
  );
  const affectedRows = result.affectedRows;
  return { affectedRows };
}

/**
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 */
export async function deletePedido(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query("DELETE FROM Pedido WHERE id = ?", [id]);
  const affectedRows = result.affectedRows;
  return { affectedRows };
}
