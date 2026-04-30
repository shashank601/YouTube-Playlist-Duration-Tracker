import express from 'express';
import auth from './authRoutes.js';
import playlist from './playlistRoutes.js';
import external from './youtubeRoute.js';
import verifyToken from '../middlewares/verifyToken.js';


const router = express.Router();

router.use('/auth', auth);
router.use('/playlists',verifyToken , playlist);
router.use('/external' ,external);




export default router;