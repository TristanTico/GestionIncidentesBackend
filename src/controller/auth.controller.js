import { prisma } from "../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { crearToken } from "../libs/jwt.js ";

export const login = async (req, res) => {
  try {
    const { ct_correo, ct_clave } = req.body;
    const usuario = await prisma.t_usuarios.findFirst({
      where: {
        ct_correo,
      },
      include: {
        t_departamento: true, // Incluye la información del departamento
      },
    });

    if (!usuario || usuario.ct_clave !== ct_clave) {
      return res.status(401).json({ error: "Correo o Contraseña incorrecta" });
    }

    const token = await crearToken({
      id: usuario.cn_cod_usuario,
      nombre: usuario.ct_nombre,
    });

    res.cookie("token", token);

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      id: usuario.cn_cod_usuario,
      nombre: usuario.ct_nombre,
      correo: usuario.ct_correo,
      departamento: usuario.t_departamento?.ct_descripcion,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: "Cierre de sesión exitoso" });
};

export const profile = async (req, res) => {
  try {
    const usuario = await prisma.t_usuarios.findFirst({
      where: {
        cn_cod_usuario: req.usuario.id,
      },
      include: {
        t_departamento: true,
      },
    });
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json({
      id: usuario.cn_cod_usuario,
      nombre: usuario.ct_nombre,
      correo: usuario.ct_correo,
      departamento: usuario.t_departamento?.ct_descripcion,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
export const recargarToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, JWT_SECRET, async (error, usuarios) => {
    if (error) return res.sendStatus(401);

    try {
      const userFound = await prisma.t_usuarios.findFirst({
        where: {
          id: usuarios.cn_cod_usuario,
        },
      });

      if (!userFound) return res.sendStatus(401);

      return res.json({
        id: userFound.cn_cod_usuario,
        nombre: userFound.ct_nombre,
        correo: userFound.ct_correo
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500); // Error del servidor
    }
  });
};
*/

export const recargarToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) return res.sendStatus(401);

    try {
      const userFound = await prisma.t_usuarios.findFirst({
        where: { cn_cod_usuario: decoded.id },
        include: {
          t_departamento: true, // Incluye la información del departamento
        },
      });

      if (!userFound) return res.sendStatus(401);

      return res.json({
        id: userFound.cn_cod_usuario,
        nombre: userFound.ct_nombre,
        correo: userFound.ct_correo,
        departamento: userFound.t_departamento?.ct_descripcion,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });
};
