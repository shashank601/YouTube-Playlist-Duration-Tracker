import pool from "../config/db.js"; //default
import {
  add_playlist as add_playlist_query,
  get_user_playlists as get_user_playlists_query,
  delete_playlist as delete_playlist_query,
} from "../db/queries.js"; //named
import axios from "axios";
import { durationToSeconds } from "../utils/helpers.js";

export const addPlaylist = async (req, res) => {
  const { playlistId, title } = req.body;
  const userId = req.user.userId;
  if (!playlistId || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(add_playlist_query, [
      userId,
      playlistId,
      title,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    // Check for unique constraint violation if needed
    if (err.code === "23505") {
      // duplicate entry
      return res.status(400).json({ error: "Playlist already exists" });
    }

    if (err.code === "23503") {
      // foreign key violation
      return res.status(400).json({ error: "Invalid user_id" });
    }
    res.status(500).json({ error: "Database error" });
  }
};

export const deletePlaylist = async (req, res) => {
  const playlistId = req.params.playlistId ?? req.body.playlistId;
  const userId = req.user.userId;

  if (!playlistId || !userId) {
    return res.status(400).json({
      error: "playlistId and userId are required",
    });
  }

  try {
    const result = await pool.query(delete_playlist_query, [
      userId,
      playlistId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Playlist not found",
      });
    }

    return res.status(200).json({
      message: "Playlist deleted",
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Database error",
    });
  }
};

export const getUserAllPlaylists = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const api_key = process.env.YT_API_KEY;
    const result = await pool.query(get_user_playlists_query, [userId]);
    const playlists = result.rows; //{playlist_id, title, watched_duration_seconds}

    let playlistIdAndVideoIds = {};

    for (const p of playlists) {
      const itemsResult = await axios.get(
        "https://youtube.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            playlistId: p.playlist_id,
            maxResults: 50,
            key: api_key,
          },
        },
      );

      const items = itemsResult.data.items;
      if (!items) return res.status(404).json({ error: "Playlist not found" });

      playlistIdAndVideoIds[p.playlist_id] = [];

      items.forEach((i) => {
        playlistIdAndVideoIds[p.playlist_id].push(i.snippet.resourceId.videoId);
      });
    }

    let durationForPlaylistId = {};
    for (const playlistId of Object.keys(playlistIdAndVideoIds)) {
      const videoIds = playlistIdAndVideoIds[playlistId].join(",");

      const videoResponse = await axios.get(
        "https://youtube.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "contentDetails",
            id: videoIds,
            key: api_key,
          },
        },
      );

      let sec = 0;
      const items = videoResponse.data.items;

      items.forEach((item) => {
        const duration = item.contentDetails.duration;
        sec += durationToSeconds(duration);
      });

      durationForPlaylistId[playlistId] = sec;
    }

    if (playlists.length === 0) {
      return res.status(200).json([]);
    }

    const playlistIds = playlists.map((p) => p.playlist_id).join(",");

    // batching
    const ytResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists", // dont have TotalDuration attribute
      {
        params: {
          part: "snippet",
          id: playlistIds,
          key: api_key,
        },
      },
    );

    /*
        playlistsIds,  get each videos of a playlist -> sum durations in sec
        -> add to the obj -> move to next playlist
        
        */

    const ytItems = ytResponse.data.items; // see below

    const thumbnailMap = {};

    ytItems.forEach((item) => {
      thumbnailMap[item.id] = item.snippet.thumbnails?.medium?.url || null;
    });

    // need to add totaal duratin to each playlist
    const finalData = playlists.map((p) => ({
      ...p,
      thumbnail: thumbnailMap[p.playlist_id] || null,
      totalSeconds: durationForPlaylistId[p.playlist_id] || 0,
    }));

    return res.status(200).json(finalData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/*

ytItems
  response
 └─ items[]                       ← array of playlist entries
      └─ item
          ├─ kind
          ├─ etag
          ├─ id                   ← playlist-item id (NOT video id)
          └─ snippet
               ├─ publishedAt
               ├─ channelId
               ├─ title
               ├─ description
               ├─ thumbnails
               │    ├─ default
               │    │    ├─ url
               │    │    ├─ width
               │    │    └─ height
               │    ├─ medium
               │    ├─ high
               │    ├─ standard
               │    └─ maxres
               ├─ channelTitle
               ├─ playlistId
               ├─ position        ← index in playlist
               ├─ resourceId
               │    ├─ kind
               │    └─ videoId    ← actual youtube video id
               ├─ videoOwnerChannelTitle
               └─ videoOwnerChannelId


videos:

  "items": [
    {
      "kind": "youtube#video",
      "etag": "nWpIzLLK8nNQaDsSC3kr3UcLkR8",
      "id": "ZI2z5pq0TqA",
      "contentDetails": {
        "duration": "PT23M21S"
      }
    }
  ]


*/
