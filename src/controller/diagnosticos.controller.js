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

    const diag = req.files;
    if (diag && diag.length > 0) {
      await Promise.all(diag.map(async (image) => {
        await prisma.t_imagenesXdiagnostico.create({
          data: {
            cn_cod_diagnostico: nuevoDiagnostico.cn_cod_diagnostico,
            ct_urlImagen: image.path,
          }
        });
      }));
    }

    // Registrar la acción en la bitácora
    const bitacoraAccion = await prisma.t_bitacoraAcciones.create({
      data: {
        ct_cod_bitacora_acciones: new Date().toISOString(), // fecha y hora actuales
        cn_cod_usuario,
        ct_referencia: `creandoDiag-${req.params.ct_cod_incidencia}-${cn_cod_usuario}-${req.body.cn_tiempoSolucion}`,
      },
    });

    res.status(201).json({
      message: "Diagnóstico creado exitosamente",
      diagnostico: nuevoDiagnostico,
      diagnosticoXIncidencia: nuevoDiagnosticoXincidencia,
      bitacoraAccion: bitacoraAccion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el diagnóstico" });
  }
};


export const getDiagnosticos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const diagnosticoXusuario =
      await prisma.t_diagnosticosXincidencias.findMany({
        where: {
          cn_cod_usuario: usuarioId,
        },
        include: {
          t_diagnosticos: true,
          t_incidencias: {
            include: {
              t_estados: true,
            },
          },
        },
      });

    if (!diagnosticoXusuario || diagnosticoXusuario.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay diagnósticos para este usuario" });
    }

    // Mapear para devolver los datos en el formato deseado
    const diagnosticos = diagnosticoXusuario.map((diagnostico) => ({
      cn_cod_diagnostico: diagnostico.t_diagnosticos.cn_cod_diagnostico,
      ct_fechaHora: diagnostico.t_diagnosticos.ct_fechaHora,
      ct_descripcion: diagnostico.t_diagnosticos.ct_descripcion,
      cn_tiempoSolucion: diagnostico.t_diagnosticos.cn_tiempoSolucion,
      ct_observacion: diagnostico.t_diagnosticos.ct_observacion,
      ct_cod_incidencia: diagnostico.ct_cod_incidencia,
      cn_cod_estado: diagnostico.t_incidencias.t_estados.cn_cod_estado,
    }));

    return res.status(200).json(diagnosticos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarEstadoTerminado = async (req, res) => {
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
        cn_cod_estado: 6,
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

export const getImagenesXdiagnostico = async (req, res) => {
  try {
    const { cn_cod_diagnostico } = req.params;
    const diagnosticoId = parseInt(cn_cod_diagnostico, 10); 
    const imagenes = await prisma.t_imagenesXdiagnostico.findMany({
      where: {
        cn_cod_diagnostico: diagnosticoId
      },
      select: {
        ct_urlImagen: true
      }
    });

    if (!imagenes || imagenes.length === 0) {
      return res.status(400).json({ message: "Este diagnostico no tiene imágenes" });
    }

    const imagenesUrls = imagenes.map(imagen => imagen.ct_urlImagen);
    return res.status(200).json(imagenesUrls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener imágenes" });
  }
}


