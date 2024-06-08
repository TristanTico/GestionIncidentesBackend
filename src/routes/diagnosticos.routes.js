import { Router } from "express";
import { crearDiagnostico } from "../controller/diagnosticos.controller.js";
import { verifyToken } from "../middleware/authenticateToken.js";

const router = Router();

router.post("/crearDiagnostico/:ct_cod_incidencia", verifyToken, crearDiagnostico);

export default router;
