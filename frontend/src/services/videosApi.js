import api from './axios.js'
import { durationToSeconds } from '../utils/helper';
// used when opening an idividual playlist for videos
export const getPlaylistProgress = (playlistId) => {
    return api.get(`/playlists/${playlistId}/videos`, {
    });
};

// unncessarily sending duration, we can just send the video id but need alot of changes for now keepingit as it is
export const mark = (playlistId, videoId,  duration) => {
    return api.post(`/playlists/${playlistId}/videos/${videoId}/mark`, {
        "duration": durationToSeconds(duration)
    });
};

export const unmark = (playlistId, videoId,  duration) => {
    return api.post(`/playlists/${playlistId}/videos/${videoId}/unmark`, {
        "duration": durationToSeconds(duration)
    });
};
