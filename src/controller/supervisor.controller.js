import { prisma } from "../db.js";

export const actualizarEstadoAprobado = async (req, res) => {
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
        cn_cod_estado: 7,
      },
    });
    return res.status(200).json({
      message: "Estado de la incidencia actualizado correctamente",
      incidencia: incidenciaActualizada,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarEstadoRechazado = async (req, res) => {
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
        cn_cod_estado: 8,
      },
    });
    return res.status(200).json({
      message: "Estado de la incidencia actualizado correctamente",
      incidencia: incidenciaActualizada,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarEstadoCerrado = async (req, res) => {
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
        ct_justificacionDeCierre: req.body.ct_justificacionDeCierre,
        cn_cod_estado: 9,
      },
    });
    return res.status(200).json({
      message: "Estado de la incidencia actualizado correctamente",
      incidencia: incidenciaActualizada,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getIncidenciasTerminadas = async (req, res) => {
  try {
    const estadosTerminados = [6, 7, 8, 9];
    const incidenciasTerminadas = await prisma.t_incidencias.findMany({
      where: {
        cn_cod_estado: {
          in: estadosTerminados,
        },
      },
    });
    if (!incidenciasTerminadas || incidenciasTerminadas.length === 0) {
      return res
        .status(400)
        .json({ message: "No hay incidencias en estado terminado" });
    }
    return res.status(200).json(incidenciasTerminadas);
  } catch (error) {
    console.log(error);
  }
};
