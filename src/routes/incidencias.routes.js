import { Router } from "express";
import { crearIncidencia, getIncidenciasXusuario, getIncidencia } from "../controller/incidencias.controller.js";
import { verifyToken } from '../middleware/authenticateToken.js';

const router = Router();

router.post("/crearIncidencia", verifyToken, crearIncidencia);
router.get("/getIncidenciasXusuario", verifyToken, getIncidenciasXusuario);
router.get("/getIncidencia/:ct_cod_incidencia", verifyToken, getIncidencia);


export default router;