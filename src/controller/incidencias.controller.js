import { prisma } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

async function generateIncidentCode() {
  const count = await prisma.t_incidencias.count();
  const siguienteCount = count + 1;
  const numeroformateado = String(siguienteCount).padStart(6, "0");
  const codIncidenteFormato = `${new Date().getFullYear()}-${numeroformateado}`;
  return codIncidenteFormato;
}


/*
export const crearIncidencia = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No hay token de autenticación" });
    }

    jwt.verify(token, JWT_SECRET, async (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: "Token inválido" });
      }

      try {
        const usuario = await prisma.t_usuarios.findFirst({
          where: { cn_cod_usuario: decoded.id },
        });

        if (!usuario) {
          return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const codIncidenteFormato = await generateIncidentCode();
        const nuevaIncidencia = await prisma.t_incidencias.create({
          data: {
            ct_cod_incidencia: codIncidenteFormato,
            ct_titulo: req.body.ct_titulo,
            ct_descripcion: req.body.ct_descripcion,
            ct_lugar: req.body.ct_lugar,
            cn_cod_usuario: usuario.cn_cod_usuario,
            cn_cod_estado: 1,
          },
        });
        return res.status(201).json({
          message: "Incidencia creada exitosamente",
          incidencia: nuevaIncidencia,
        });
      } catch (error) {
        return res.status(500).json({
          error: "Error al crear la incidencia",
          message: error.message,
        });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error interno del servidor", message: error.message });
  }
};
*/

export const crearIncidencia = async (req, res) => {
  try {
    const usuario = await prisma.t_usuarios.findFirst({
      where: { cn_cod_usuario: req.usuario.id },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const codIncidenteFormato = await generateIncidentCode();
    const nuevaIncidencia = await prisma.t_incidencias.create({
      data: {
        ct_cod_incidencia: codIncidenteFormato,
        ct_titulo: req.body.ct_titulo,
        ct_descripcion: req.body.ct_descripcion,
        ct_lugar: req.body.ct_lugar,
        cn_cod_usuario: usuario.cn_cod_usuario,
        cn_cod_estado: 1,
      },
    });
    return res.status(201).json({
      message: "Incidencia creada exitosamente",
      incidencia: nuevaIncidencia,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al crear la incidencia",
      message: error.message,
    });
  }
};


export const getIncidenciasXusuario = async (req, res) => {
  try {
    const incidencias = await prisma.t_incidencias.findMany({
      where: {
        cn_cod_usuario: req.usuario.id,
      },
    });
    if (!incidencias) {
      return res.status(400).json({ message: "No hay incidencias" });
    }
    return res.status(200).json(incidencias);
  } catch (error) {
    console.log(error);
  }
};

export const getIncidencia = async (req, res) => {
  try {
    const incidencia = await prisma.t_incidencias.findFirst({
      where: {
        ct_cod_incidencia: req.params.ct_cod_incidencia,
      },
      include: {
        t_estados: true,
      },
    });
    if (!incidencia) {
      return res.status(400).json({ message: "incidencia no encontrada" });
    }
    return res.status(200).json({
      cod_incidencia: incidencia.ct_cod_incidencia,
      cd_fecha: incidencia.cd_fechaHora,
      titulo: incidencia.ct_titulo,
      lugar: incidencia.ct_descripcion,
      justificacion: incidencia.ct_justificacionDeCierre,
      costos: incidencia.cn_costos,
      duracion: incidencia.cn_duracion,
      prioridad: incidencia.ct_prioridad,
      riesgo: incidencia.ct_riesgo,
      afectacion: incidencia.ct_afectacion,
      catagoria: incidencia.ct_categoria,
      estado: incidencia.t_estados?.ct_descripcion,
    });
  } catch (error) {}
};
