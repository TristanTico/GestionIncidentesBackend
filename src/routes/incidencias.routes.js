import { Router } from "express";
import { crearIncidencia, getIncidenciasXusuario, getIncidencia } from "../controller/incidencias.controller.js";
import { verifyToken } from '../middleware/authenticateToken.js';
import { autorizar } from "../Middleware/autorizar.js";

const router = Router();

router.post("/crearIncidencia", verifyToken, autorizar("crearIncidencia") ,crearIncidencia);
router.get("/getIncidenciasXusuario", verifyToken, autorizar("getIncidenciasXusuario") , getIncidenciasXusuario);
router.get("/getIncidencia/:ct_cod_incidencia", verifyToken, autorizar("getIncidencia") ,getIncidencia);


export default router;