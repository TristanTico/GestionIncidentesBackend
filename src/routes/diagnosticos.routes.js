import { Router } from "express";
import { crearDiagnostico, getDiagnosticos, actualizarEstadoTerminado, getImagenesXdiagnostico } from "../controller/diagnosticos.controller.js";
import { verifyToken } from "../middleware/authenticateToken.js";

const router = Router();

router.post("/crearDiagnostico/:ct_cod_incidencia", verifyToken, crearDiagnostico);
router.get("/getDiagnosticos", verifyToken, getDiagnosticos);
router.put(`/actualizarEstadoTerminado/:ct_cod_incidencia`, verifyToken, actualizarEstadoTerminado);
router.get(`/getImagenesXdiagnostico/:cn_cod_diagnostico`, verifyToken, getImagenesXdiagnostico);


export default router;
