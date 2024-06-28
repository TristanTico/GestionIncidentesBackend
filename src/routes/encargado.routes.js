import { Router } from "express";
import {
  asignarIncidencia,
  getCargaTrabajo,
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
router.get("/getReporteCargaTrabajo", verifyToken, getCargaTrabajo);

export default router;
