import express from 'express'
import {getUserAllPlaylists, addPlaylist, deletePlaylist} from '../controllers/playlistController.js'
import videoRoutes from './videosRoutes.js'

const router = express.Router();

router.get('/', getUserAllPlaylists);
router.post('/', addPlaylist);
router.delete('/:playlistId', deletePlaylist);


router.use('/:playlistId/videos', videoRoutes);

export default router;














// playlist management routes