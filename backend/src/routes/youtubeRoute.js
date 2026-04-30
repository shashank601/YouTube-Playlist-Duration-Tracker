import express from 'express';
import { get_playlist } from '../controllers/youtubeController.js'

const router = express.Router();


router.get('/playlist', get_playlist);  





// no db call only external yt api 
// eg: GET /external/playlist?playlistId=xxxx

export default router;