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
    const { ct_cod_incidencia } = req.params;
    const incidencia = await prisma.t_incidencias.findFirst({
      where: {
        ct_cod_incidencia,
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

export const getIncidenciaRegistradas = async (req, res) => {
  try {
    const incidencias = await prisma.t_incidencias.findMany({
      where: {
        cn_cod_estado: 1,
      },
      include: {
        t_usuarios: true,
      },
    });
    if (!incidencias || incidencias.length === 0) {
      return res.status(400).json({ message: "No hay incidencias" });
    }
    return res.status(200).json(incidencias);
  } catch (error) {
    console.log(error);
  }
};

export const getIncidenciasAsignadas = async (req, res) => {
  try {
    const usuariosId = req.usuario.id;

    /*
    const incidenciasAsignadas = await prisma.t_asignacionesIncidencias.findMany({
      where: { cn_cod_usuario: usuariosId },
      include: {
        t_incidencias: true
      }
    })
      */

    const usuarioConIncidencias = await prisma.t_usuarios.findFirst({
      where: { cn_cod_usuario: usuariosId },
      include: {
        t_asignacionesIncidencias: {
          include: {
            t_incidencias: true,
          },
        },
      },
    });

    if (
      !usuarioConIncidencias ||
      usuarioConIncidencias.t_asignacionesIncidencias.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "No tienes incidencias asignadas" });
    }

    const incidencias = usuarioConIncidencias.t_asignacionesIncidencias.map(
      (asignacion) => asignacion.t_incidencias
    );

    return res.status(200).json(incidencias);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarEstadoRevision = async (req, res) => {
  try {
    const { ct_cod_incidencia } = req.params;
    const incidencia = await prisma.t_incidencias.findFirst({
      where: {
        ct_cod_incidencia,
      },
    });
    if (!incidencia) {
      return res.status(404).json({ message: "Incidencia no encontrada" });
    }
    const incidenciaActualizada = await prisma.t_incidencias.update({
      where: {
        ct_cod_incidencia,
      },
      data: {
        cn_cod_estado: 3,
      },
    });
    return res.status(200).json({
      message: "Estado de la incidencia actualizado correctamente",
      incidencia: incidenciaActualizada,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarEstadoReparacion = async (req, res) => {
  try {
    const { ct_cod_incidencia } = req.params;
    const usuariosId = req.usuario.id; // Asumiendo que tienes el ID del usuario autenticado en `req.usuario.id`

    // Verificar si el usuario ya tiene una incidencia asignada en estado 4
    const incidenciaEnReparacion = await prisma.t_asignacionesIncidencias.findFirst({
      where: {
        cn_cod_usuario: usuariosId,
        t_incidencias: {
          cn_cod_estado: 4,
        },
      },
      include: {
        t_incidencias: true,
      },
    });

    if (incidenciaEnReparacion) {
      return res.status(400).json({ message: "Ya tienes una incidencia en estado de reparación" });
    }

    // Verificar si la incidencia que se quiere actualizar existe y está asignada al usuario autenticado
    const incidenciaAsignada = await prisma.t_asignacionesIncidencias.findFirst({
      where: {
        ct_cod_incidencia,
        cn_cod_usuario: usuariosId, // Asegurarse de que la incidencia está asignada al usuario autenticado
      },
      include: {
        t_incidencias: true,
      },
    });

    if (!incidenciaAsignada) {
      return res.status(404).json({ message: "Incidencia no encontrada o no asignada al usuario autenticado" });
    }

    // Actualizar el estado de la incidencia a 4
    const incidenciaActualizada = await prisma.t_incidencias.update({
      where: {
        ct_cod_incidencia,
      },
      data: {
        cn_cod_estado: 4,
      },
    });

    return res.status(200).json({
      message: "Estado de la incidencia actualizado correctamente",
      incidencia: incidenciaActualizada,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};



