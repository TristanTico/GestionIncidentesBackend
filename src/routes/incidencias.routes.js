import { Router } from "express";
import {
  crearIncidencia,
  getIncidenciasXusuario,
  getIncidencia,
  getIncidenciaRegistradas,
  getIncidenciasAsignadas,
  actualizarEstadoRevision,
  actualizarEstadoReparacion,
  getImagenesXIncidencia,
  getTablaImagenes,
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
router.get("/getIncidencia/:ct_cod_incidencia", verifyToken, getIncidencia);
router.get("/getIncidenciaRegistradas", verifyToken, getIncidenciaRegistradas);

router.get("/getIncidenciasAsignadas", verifyToken, getIncidenciasAsignadas);

router.put(
  "/actualizarEstadoRevision/:ct_cod_incidencia",
  verifyToken,
  actualizarEstadoRevision
);

router.put(
  "/actualizarEstadoReparacion/:ct_cod_incidencia",
  verifyToken,
  actualizarEstadoReparacion
);

router.get("/getImagenesIncidencia/:ct_cod_incidencia", verifyToken, getImagenesXIncidencia);
//router.get("/getTablaImagenes", verifyToken, getTablaImagenes);

export default router;
