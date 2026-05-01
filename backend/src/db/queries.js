/*===================[    Auth   ]=============================*/
// post /register
// post /login

// route level
export const register = `
INSERT INTO accounts (username, email, hashed_pwd)
VALUES ($1, $2, $3) 
RETURNING username, email;`;

// route level
export const login = `
    SELECT id, username, hashed_pwd
    FROM accounts
    WHERE email = $1;
`;

/*========================[  playlist mgmt  ]========================*/

// post /playlists
// dlete /playlist/:id 
// get /playlists


export const add_playlist = `
INSERT INTO playlists (user_id, playlist_id, title) 
VALUES ($1, $2, $3) 
RETURNING *;`;



export const delete_playlist = `
DELETE FROM playlists
WHERE user_id = $1 AND playlist_id = $2
RETURNING *;
`;

// frontend will open a new page so its route level api (navigate)
export const get_user_playlists = `
SELECT p.playlist_id, p.title, COALESCE(SUM(uv.duration), 0) AS watched_duration_seconds
FROM playlists p
LEFT JOIN user_videos uv
ON uv.user_id = p.user_id  AND uv.playlist_id = p.playlist_id AND uv.is_watched = TRUE
WHERE p.user_id = $1
GROUP BY p.playlist_id, p.title
ORDER BY p.title;
`;

/*========================[  videos status mgmt  ]========================*/
// Check if user is tarcking this playlistid

// playlists child route "/:playlistId/videos" 


// GET /playlists/:playlistId/videos 
// POST /playlists/:playlistId/videos/:videoId/mark 
// POST /playlists/:playlistId/videos/:videoId/unmark

// used in verification whethe a user tracks a playlist or not
export const check_user_playlist = `
    SELECT 1 FROM playlists
    WHERE user_id = $1 AND playlist_id = $2;
`;


// it returns mulitple rows w/ there status
export const get_playlist_videos_status = `
    SELECT video_id, is_watched, duration
    FROM user_videos
    WHERE user_id = $1 AND playlist_id = $2;
    `;


// insert and if already exist we do update (on conflict)
export const mark_as_watched = `
    INSERT INTO user_videos (user_id, playlist_id, video_id, is_watched, duration)
    VALUES ($1, $2, $3, TRUE, $4)
    ON CONFLICT (user_id, playlist_id, video_id) DO UPDATE
    SET is_watched = TRUE,
        duration = $4
    RETURNING *;
`;




// insert and if already exist we do update (on conflict)
export const mark_as_unwatched = `
    INSERT INTO user_videos (user_id, playlist_id, video_id, is_watched, duration)
    VALUES ($1, $2, $3, FALSE, $4)
    ON CONFLICT (user_id, playlist_id, video_id) DO UPDATE
    SET is_watched = FALSE,
        duration = $4
    RETURNING *;
`;
