import express from 'express';
import { googleLogin } from '../../controllers/client/auth.controller.js';

const router = express.Router();

// POST /auth/google
router.post('/google', googleLogin);

export default router;
