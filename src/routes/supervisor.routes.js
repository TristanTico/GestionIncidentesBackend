import { Router } from "express";
import {
  actualizarEstadoAprobado,
  actualizarEstadoCerrado,
  actualizarEstadoRechazado,
  getIncidenciasTerminadas,
} from "../controller/supervisor.controller.js";
import { verifyToken } from "../middleware/authenticateToken.js";

const router = Router();

router.get("/getIncidenciasTerminadas", verifyToken, getIncidenciasTerminadas);
router.put("/actualizarEstadoAprobado/:ct_cod_incidencia", verifyToken, actualizarEstadoAprobado);
router.put("/actualizarEstadoCerrado/:ct_cod_incidencia", verifyToken, actualizarEstadoCerrado);
router.put("/actualizarEstadoRechazado/:ct_cod_incidencia", verifyToken, actualizarEstadoRechazado);

export default router;
