import {Router} from 'express';
import { login, logout, profile, recargarToken } from '../controller/auth.controller.js';
import { verifyToken } from '../middleware/authenticateToken.js';

const router = Router();

router.post("/login", login)
router.post("/logout", logout);
router.get("/verify", recargarToken);
router.get("/profile", verifyToken, profile);

export default router;