import { Router } from "express";
import { getUsuarios } from "../controller/usuarios.controller.js";
import { verifyToken } from '../middleware/authenticateToken.js';

const router = Router();

router.get("/getUsuarios", verifyToken, getUsuarios);


export default router;
