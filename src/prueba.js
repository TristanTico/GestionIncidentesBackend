import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());
app.use(cors());

// Ruta de inicio de sesión
app.post("/login", async (req, res) => {
  try {
    const { ct_correo, ct_clave } = req.body;
    const usuario = await prisma.usuarios.findFirst({ where: { ct_correo } });

    if (!usuario || usuario.ct_clave !== ct_clave) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { cn_cod_usuario: usuario.cn_cod_usuario },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login exitoso", token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del formato "Bearer <token>"


  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) {
      console.log(usuario);
      return res.status(403).json({ error: "Invalid token" });
    }
    req.usuario = usuario;
    next();
  });
};

// Ruta protegida
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "rutaProtegida", usuario: req.usuario });
});

app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});
