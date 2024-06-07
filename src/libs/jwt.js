import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { prisma } from "../db.js";

export async function crearToken(payload) {
  
  const roles = await obtenerRolesUsuario(payload.id); 

 
  const tokenPayload = {
    ...payload,
    roles: roles.map(role => role.ct_descripcion), 
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      tokenPayload,
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

async function obtenerRolesUsuario(usuarioId) {


  const usuario = await prisma.t_usuarios.findFirst({
    where: {
      cn_cod_usuario: usuarioId,
    },
    include: {
      t_rolesXusuarios: {
        include: {
          t_roles: true,
        },
      },
    },
  });
  

  if (!usuario || !usuario.t_rolesXusuarios) {
    return []; // Retorna un array vacío si no se encuentran roles o el usuario es null
  }

  return usuario.t_rolesXusuarios.map(rol => rol.t_roles);
}