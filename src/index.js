import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import incidenciasRoutes from "./routes/incidencias.routes.js"
import diagnosticosRoutes from "./routes/diagnosticos.routes.js"
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(cookieParser());

app.use("/sgi", usuariosRoutes);
app.use("/sgi", authRoutes);
app.use("/sgi", incidenciasRoutes);
app.use("/sgi", diagnosticosRoutes);

app.listen(3000);
console.log("Puerto 3000");
