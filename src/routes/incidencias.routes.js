import { Router } from "express";
import {
  crearIncidencia,
  getIncidenciasXusuario,
  getIncidencia,
  getIncidenciaRegistradas,
  getIncidenciasAsignadas,
  actualizarEstadoRevision,
  actualizarEstadoReparacion
} from "../controller/incidencias.controller.js";
import { verifyToken } from "../middleware/authenticateToken.js";
import { autorizar } from "../Middleware/autorizar.js";

const router = Router();

router.post(
  "/crearIncidencia",
  verifyToken,
  autorizar("crearIncidencia"),
  crearIncidencia
);
router.get(
  "/getIncidenciasXusuario",
  verifyToken,
  autorizar("getIncidenciasXusuario"),
  getIncidenciasXusuario
);
router.get(
  "/getIncidencia/:ct_cod_incidencia",
  verifyToken,
  autorizar("getIncidencia"),
  getIncidencia
);
router.get("/getIncidenciaRegistradas", verifyToken, getIncidenciaRegistradas);

router.get("/getIncidenciasAsignadas", verifyToken, getIncidenciasAsignadas);

router.put("/actualizarEstadoRevision/:ct_cod_incidencia", verifyToken, actualizarEstadoRevision);

router.put("/actualizarEstadoReparacion/:ct_cod_incidencia", verifyToken, actualizarEstadoReparacion);

export default router;
