import { prisma } from "../db.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.t_usuarios.findMany();
    res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

