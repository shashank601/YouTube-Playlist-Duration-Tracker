import api from './axios.js'

/*
[{"playlist_id":"PLot-Xpze53letfIu9dMzIIO7na_sqvl0w","title":"HARD","watched_duration_seconds":"0","thumbnail":"https://i.ytimg.com/vi/q6IEA26hvXc/mqdefault.jpg"}]
*/

export const getUserPlaylists = () => {
    return api.get(`/playlists`);
};




export const addPlaylist = (playlistId, title) => {
    return api.post(`/playlists`, { playlistId, title});
};




export const deletePlaylist = (playlistId) => {
    return api.delete(`/playlists/${playlistId}`, {
    });
};

// needs a rate limiter
export const searchPlaylist = (playlistId) => {
    return api.get(`/external/playlist`, {
        params: {
            playlistId
        }
    });
  
}



