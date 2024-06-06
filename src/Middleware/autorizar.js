import { prisma } from "../db.js";
import { permisos } from "../libs/permisos.js";

export const autorizar = (accion) => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.usuario.id;

      const usuarioRoles = await prisma.t_rolesXusuarios.findMany({
        where: { cn_cod_usuario: usuarioId },
        include: {
          t_roles: true,
        },
      });

      const rolesDelUsuario = usuarioRoles.map((ur) => ur.t_roles.ct_descripcion);
      const tienePermiso = permisos[accion].some((role) =>
        rolesDelUsuario.includes(role)
      );

      if (!tienePermiso) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para realizar esta acción" });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al verificar permisos", error: error.message });
    }
  };
};
