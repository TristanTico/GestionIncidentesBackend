import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import { fileURLToPath } from 'url';
import path from "path";
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import incidenciasRoutes from "./routes/incidencias.routes.js"
import diagnosticosRoutes from "./routes/diagnosticos.routes.js"
import encargadoRoutes from "./routes/encargado.routes.js"
import supervisorRoutes from "./routes/supervisor.routes.js"
import { FRONTEND_URL } from "./config.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/incidencias')); // Directorio de destino para las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nombre del archivo
  }
});

const upload = multer({ storage: storage });

/*
// Configurar almacenamiento de multer
const storageDiag = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/diagnosticos')); // Directorio de destino para las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nombre del archivo
  }
});

const uploadDiag = multer({ storage: storageDiag });
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array('images', 10));
//app.use(uploadDiag.array('diag', 10));
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
app.use("/sgi", encargadoRoutes);
app.use("/sgi", supervisorRoutes);

app.use('/images', express.static(path.join(__dirname, 'uploads/incidencias')));
//app.use('/diag', express.static(path.join(__dirname, 'uploads/diagnosticos')));

app.listen(3000);
console.log("Puerto 3000");
