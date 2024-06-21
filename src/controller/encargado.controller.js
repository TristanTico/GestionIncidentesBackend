import { prisma } from "../db.js";
import { EmailAsignacion } from "../mailConfig.js";

export const asignarIncidencia = async (req, res) => {
  try {
    const { ct_cod_incidencia } = req.params;

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
