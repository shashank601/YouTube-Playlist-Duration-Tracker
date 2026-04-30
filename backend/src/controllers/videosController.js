import pool from "../config/db.js";
import {
  get_playlist_videos_status,
  mark_as_unwatched,
  mark_as_watched,
  check_user_playlist,
} from "../db/queries.js";
import axios from "axios";
import { durationToSeconds } from "../utils/helpers.js";

export const getPlaylistVideosStatus = async (req, res) => {
  const playlist_id = req.params.playlistId;
  const user_id = req.user.userId;
  const api_key = process.env.YT_API_KEY;

  if (!user_id || !playlist_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if user actually has this playlist tracked as we are actually calling yt api directly so user migth add a playlistId he dont own and we render his request obviously with zero progress
    const playlistCheck = await pool.query(check_user_playlist, [
      user_id,
      playlist_id,
    ]);
    if (playlistCheck.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Playlist not found in your tracked list" });
    }

    const dbResult = await pool.query(
      // {videoId, isWatched}
      get_playlist_videos_status,
      [user_id, playlist_id],
    );

    // videoIds string
    const itemsResult = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: playlist_id,
          maxResults: 50,
          key: api_key,
        },
      },
    );

    const items = itemsResult.data.items;

    if (!items) return res.status(404).json({ error: "Playlist not found" });

    let playlistItems = {};

    let videoIds = [];

    // we are doing two tasks here
    // create a video ids strnig so we can batch and save tokens
    // create res obj with video details
    items.forEach((item) => {
      const vId = item?.snippet?.resourceId?.videoId;
      if (!vId) {
        return;
      }

      // collect video ids
      videoIds.push(vId);

      // collect video details
      playlistItems[vId] = {
        title: item?.snippet?.title ?? null,
        thumbnailURL: item?.snippet?.thumbnails?.default?.url ?? null,
        publishedAt: item?.snippet?.publishedAt ?? null,
      };
    });

    if (videoIds.length === 0) {
      return res
        .status(200)
        .json({ videos: [], totalSec: 0, totalWatchedSeconds: 0 });
    }

    const videoIdsString = videoIds.join(",");

    // calling for durations of videos
    const videoResponse = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "contentDetails",
          id: videoIdsString,
          key: api_key,
        },
      },
    );
    // data.items.contentdetails.durations

    const videoItems = videoResponse.data.items;

    let totalSec = 0;
    let totalWatchedSeconds = 0;

    // for O(1) lookup
    const isWatchedMap = {};

    dbResult.rows.forEach((row) => {
      isWatchedMap[row.video_id] = row.is_watched;
    });

    (videoItems || []).forEach((item) => {
      const duration = item?.contentDetails?.duration;
      const vId = item.id;
      if (!vId) {
        return;
      }

      if (!playlistItems[vId]) {
        // we will put dummy data if anything is missing for a vId and avoid getting undefined
        playlistItems[vId] = {
          title: null,
          thumbnailURL: null,
          publishedAt: null,
        };
      }

      if (vId in isWatchedMap) {
        if (isWatchedMap[vId]) {
          totalWatchedSeconds += durationToSeconds(duration);
          playlistItems[vId].isWatched = true;
        }
      } else {
        playlistItems[vId].isWatched = false;
      }

      playlistItems[vId].duration = duration;
      totalSec += durationToSeconds(duration);
    });

    // i have playlistItems{title thumbnail publishedAt} and videoIdandDurationMap {druration} and now need isWatched. done!

    // let responseObj = {};
    // for (const videoId of Object.keys(playlistItems)) {

    // }

    /*
    [{ 
        thumnail
        video titel
        duration 
        status
    }, {totalDuration: totalSec,
    watched_durations_Seconds}]
        */

    // fetch videos for this playlist id

    // fetch and join all video id

    // and now an api call for duration

    // use db data to check video staus watched or not if watched do True/false if not exist in db do false

    // calculate total watched and totalduration for this playlist

    // done

    const videoArr = Object.entries(playlistItems).map(([id, obj]) => ({
      videoId: id,
      ...obj,
    }));

    return res
      .status(200)
      .json({ videos: videoArr, totalSec, totalWatchedSeconds });
  } catch (err) {
    console.error(
      "getPlaylistVideosStatus failed:",
      err?.response?.data || err,
    );

    return res.status(500).json({ error: "Failed to fetch playlist videos" });
  }
};

export const markAsWatched = async (req, res) => {
  const playlist_id = req.params.playlistId;
  const video_id = req.params.videoId;
  const user_id = req.user.userId;
  const { duration } = req.body;

  if (!user_id || !playlist_id || !video_id || duration === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(mark_as_watched, [
      user_id,
      playlist_id,
      video_id,
      duration,
    ]);

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
};

export const markAsUnwatched = async (req, res) => {
  const playlist_id = req.params.playlistId;
  const video_id = req.params.videoId;
  const user_id = req.user.userId;
  const { duration } = req.body;

  if (!user_id || !playlist_id || !video_id || duration === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(mark_as_unwatched, [
      user_id,
      playlist_id,
      video_id,
      duration,
    ]);

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }
};

/*
items": [
        {
            "id": "B1TASfGcnRM",
            "contentDetails": {
                "duration": "PT1M39S",
            }
        }

// dbResults:
/*
{
  command: "SELECT",
  rowCount: 3,
  rows: [
    { video_id: "abc123", is_watched: true },
    { video_id: "def456", is_watched: false },
    { video_id: "ghi789", is_watched: true }
  ],
  fields: [...],
}

*/
