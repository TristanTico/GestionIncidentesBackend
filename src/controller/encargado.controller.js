import { prisma } from "../db.js";
import { EmailAsignacion } from "../mailConfig.js";



export const asignarIncidencia = async (req, res) => {
  try {
    const { ct_cod_incidencia } = req.params;
    const usuarioAutenticado = req.usuario.id;

    const incidenciaActualizada = await prisma.t_incidencias.update({
      where: {
        ct_cod_incidencia,
      },
      data: {
        cn_costos: req.body.cn_costos,
        cn_duracion: req.body.cn_duracion,
        ct_prioridad: req.body.ct_prioridad,
        ct_riesgo: req.body.ct_riesgo,
        ct_afectacion: req.body.ct_afectacion,
        ct_categoria: req.body.ct_categoria,
        cn_cod_estado: 2,
      },
    });

    // Crear las asignaciones
    const usuariosData = req.body.usuarios; // Aquí obtenemos la lista de usuarios del cuerpo de la solicitud
    const asignacionesData = usuariosData.map((usuario) => ({
      cn_cod_usuario: usuario.cn_cod_usuario,
      ct_cod_incidencia: ct_cod_incidencia,
    }));

    const asignaciones = await prisma.t_asignacionesIncidencias.createMany({
      data: asignacionesData,
      skipDuplicates: true,
    });

    // Registrar las acciones en la bitácora
    for (const usuario of usuariosData) {
      await prisma.t_bitacoraAcciones.create({
        data: {
          ct_cod_bitacora_acciones: new Date().toISOString(), // fecha y hora actuales
          cn_cod_usuario: usuario.cn_cod_usuario,
          ct_referencia: `asignando-${ct_cod_incidencia}-${usuario.cn_cod_usuario}-${incidenciaActualizada.ct_afectacion}-${incidenciaActualizada.ct_prioridad}-${incidenciaActualizada.ct_riesgo}`,
        },
      });
    }

    const bitacoraEstado = await prisma.t_bitacoraEstados.create({
      data: {
        ct_fecha_cambio : new Date().toISOString(),
        cn_cod_usuario : usuarioAutenticado,
        ct_cod_incidencia : ct_cod_incidencia,
        cn_estadoViejo: 1,
        cn_estadoNuevo: incidenciaActualizada.cn_cod_estado
      }
    })

    /*
    usuariosData.forEach((usuario) => {
      try {
        EmailAsignacion(
          usuario.ct_correo,
          usuario.ct_nombre,
          ct_cod_incidencia
        );
        console.log(`Correo electrónico enviado a ${usuario.ct_correo}`);
      } catch (error) {
        console.error(
          `Error al enviar correo electrónico a ${usuario.ct_correo}:`,
          error
        );
      }
    });
    */

    res.status(201).json({
      message: "Asignacion creada exitosamente",
      incidencia: incidenciaActualizada,
      asignaciones: asignaciones,
      bitacoraEstado: bitacoraEstado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la asignacion" });
  }
};



export const getTecnicos = async (req, res) => {
  try {
    const tecnicos = await prisma.t_rolesXusuarios.findMany({
      where: {
        cn_cod_rol: 4,
      },
      include: {
        t_usuarios: true,
      },
    });
    if (!tecnicos || tecnicos.length === 0) {
      return res
        .status(400)
        .json({ message: "No hay usuarios con rol de técnico" });
    }

    const tecnicosDetalles = tecnicos.map((tecnico) => tecnico.t_usuarios);

    res.status(200).json(tecnicosDetalles);
  } catch (error) {
    console.log(error);
  }
};


export const getCargaTrabajo = async (req, res) => {
  try {
    // Obtener los usuarios con rol de técnico (rol 4) y sus asignaciones de incidencias
    const tecnicos = await prisma.t_rolesXusuarios.findMany({
      where: {
        cn_cod_rol: 4,
      },
      include: {
        t_usuarios: {
          select: {
            ct_nombre: true,
            t_asignacionesIncidencias: {
              include: {
                t_incidencias: {
                  include: {
                    t_estados: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!tecnicos || tecnicos.length === 0) {
      return res.status(400).json({ message: "No hay usuarios con rol de técnico" });
    }

    // Procesar los datos
    const result = tecnicos
      .filter((tecnico) => tecnico.t_usuarios.t_asignacionesIncidencias.length > 0) // Filtrar solo los técnicos con asignaciones de incidencias
      .map((tecnico) => {
        const categorias = {};

        tecnico.t_usuarios.t_asignacionesIncidencias.forEach((asignacion) => {
          const incidencia = asignacion.t_incidencias;

          // Si la categoría no existe en el objeto categorías, se inicializa
          if (!categorias[incidencia.ct_categoria]) {
            categorias[incidencia.ct_categoria] = {
              categoria: incidencia.ct_categoria || "Sin categoría",
              trabajoPendiente: [],
              trabajoTerminado: [],
              sumatoriaDuracionPendiente: 0,
              sumatoriaDuracionTerminado: 0,
            };
          }

          // Determinar si la incidencia está terminada o pendiente
          const duracion = incidencia.cn_duracion || 0;
          if (incidencia.t_estados.cn_cod_estado === 9) {
            categorias[incidencia.ct_categoria].trabajoTerminado.push({
              codigo: incidencia.ct_cod_incidencia,
              titulo: incidencia.ct_titulo,
              duracion: duracion,
            });
            categorias[incidencia.ct_categoria].sumatoriaDuracionTerminado += duracion;
          } else {
            categorias[incidencia.ct_categoria].trabajoPendiente.push({
              codigo: incidencia.ct_cod_incidencia,
              titulo: incidencia.ct_titulo,
              duracion: duracion,
            });
            categorias[incidencia.ct_categoria].sumatoriaDuracionPendiente += duracion;
          }
        });

        return {
          usuario: {
            nombre: tecnico.t_usuarios.ct_nombre,
          },
          categorias: Object.values(categorias), // Convertir el objeto en un array de categorías
        };
      });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los datos de técnicos e incidencias" });
  }
};


