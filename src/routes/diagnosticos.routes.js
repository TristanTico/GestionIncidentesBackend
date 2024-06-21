import { Router } from "express";
import { crearDiagnostico, getDiagnosticos } from "../controller/diagnosticos.controller.js";
import { verifyToken } from "../middleware/authenticateToken.js";

const router = Router();

router.post("/crearDiagnostico/:ct_cod_incidencia", verifyToken, crearDiagnostico);
router.get("/getDiagnosticos", verifyToken, getDiagnosticos);

export default router;
