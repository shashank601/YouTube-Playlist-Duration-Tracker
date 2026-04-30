import express from 'express'
import {register, login, verify} from '../controllers/authController.js'

import verifyToken from '../middlewares/verifyToken.js'


const router = express.Router();
// just to check user jwt is expired or not, simple controller
router.get("/verify", verifyToken, verify);

router.post('/register', register);
router.post('/login', login);
//router.post('/logout', );

export default router;