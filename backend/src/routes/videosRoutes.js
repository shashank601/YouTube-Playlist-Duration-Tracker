import express from 'express';
import { getPlaylistVideosStatus, markAsWatched, markAsUnwatched} from '../controllers/videosController.js';


const router = express.Router({ mergeParams: true }); // to get params(:playlistId) from parent route this router cannot access parent res w/o this

router.get('/', getPlaylistVideosStatus);
router.post('/:videoId/mark', markAsWatched); 
router.post('/:videoId/unmark', markAsUnwatched); 

export default router;
// video related  to marking videos as watched/unwatched and fetching video statuses