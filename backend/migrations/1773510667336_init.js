
export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        hashed_pwd VARCHAR(255) NOT NULL CHECK (char_length(hashed_pwd) >= 9)
    );

    CREATE TABLE IF NOT EXISTS playlists (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        playlist_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        UNIQUE(user_id, playlist_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_videos (
        user_id INT NOT NULL,
        playlist_id VARCHAR(255) NOT NULL,
        video_id VARCHAR(255) NOT NULL,
        is_watched BOOLEAN NOT NULL,
        duration INT NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, playlist_id, video_id),
        FOREIGN KEY (user_id, playlist_id) 
          REFERENCES playlists(user_id, playlist_id) 
          ON DELETE CASCADE
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS user_videos;
    DROP TABLE IF EXISTS playlists;
    DROP TABLE IF EXISTS users;
  `);
};

//npx node-pg-migrate up