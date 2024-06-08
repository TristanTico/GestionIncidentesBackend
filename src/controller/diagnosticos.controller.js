import { prisma } from "../db.js";

export const crearDiagnostico = async (req, res) => {
  try {
    //const { ct_cod_incidencia } = req.params;
    // { ct_descripcion, cn_tiempoSolucion, ct_observacion } = req.body;
    const cn_cod_usuario = req.usuario.id;

    const nuevoDiagnostico = await prisma.t_diagnosticos.create({
      data: {
        ct_descripcion : req.body.ct_descripcion,
        cn_tiempoSolucion : req.body.cn_tiempoSolucion,
        ct_observacion: req.body.ct_observacion,
      },
    });

    const nuevoDiagnosticoXincidencia =
      await prisma.t_diagnosticosXincidencias.create({
        data: {
          cn_cod_diagnostico: nuevoDiagnostico.cn_cod_diagnostico,
          ct_cod_incidencia : req.params.ct_cod_incidencia,
          cn_cod_usuario,
        },
      });

    res.status(201).json({
      message: "Diagnóstico creado exitosamente",
      diagnostico: nuevoDiagnostico,
      diagnosticoXIncidencia: nuevoDiagnosticoXincidencia,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el diagnóstico" });
  }
};
