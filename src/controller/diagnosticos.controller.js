import { prisma } from "../db.js";

export const crearDiagnostico = async (req, res) => {
  try {
    const cn_cod_usuario = req.usuario.id;

    const nuevoDiagnostico = await prisma.t_diagnosticos.create({
      data: {
        ct_descripcion: req.body.ct_descripcion,
        cn_tiempoSolucion: req.body.cn_tiempoSolucion,
        ct_observacion: req.body.ct_observacion,
      },
    });

    const nuevoDiagnosticoXincidencia =
      await prisma.t_diagnosticosXincidencias.create({
        data: {
          cn_cod_diagnostico: nuevoDiagnostico.cn_cod_diagnostico,
          ct_cod_incidencia: req.params.ct_cod_incidencia,
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

export const getDiagnosticos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const diagnosticoXusuario = await prisma.t_diagnosticosXincidencias.findMany({
      where: {
        cn_cod_usuario: usuarioId,
      },
      include: {
        t_diagnosticos: true,
        t_incidencias: true,
      },
    });

    if (!diagnosticoXusuario || diagnosticoXusuario.length === 0) {
      return res.status(404).json({ message: "No hay diagnósticos para este usuario" });
    }

    // Mapear para devolver los datos en el formato deseado
    const diagnosticos = diagnosticoXusuario.map((diagnostico) => ({
      cn_cod_diagnostico: diagnostico.t_diagnosticos.cn_cod_diagnostico,
      ct_fechaHora: diagnostico.t_diagnosticos.ct_fechaHora,
      ct_descripcion: diagnostico.t_diagnosticos.ct_descripcion,
      cn_tiempoSolucion: diagnostico.t_diagnosticos.cn_tiempoSolucion,
      ct_observacion: diagnostico.t_diagnosticos.ct_observacion,
      ct_cod_incidencia: diagnostico.ct_cod_incidencia,
    }));

    return res.status(200).json(diagnosticos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


