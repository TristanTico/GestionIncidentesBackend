import { Router } from "express";
import {
  asignarIncidencia,
  getTecnicos,
} from "../controller/encargado.controller.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = Router();

router.post(
  "/asignarIncidencia/:ct_cod_incidencia",
  verifyToken,
  asignarIncidencia
);
router.get("/getTecnicos", verifyToken, getTecnicos);

export default router;
