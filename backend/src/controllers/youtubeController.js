import axios from "axios";
import { durationToSeconds } from "../utils/helpers.js";



// a helper function as yt api returns different format for duration so to parse ISO duration to HH:MM:SS format




export const get_playlist = async (req, res) => {
  const playlistId = req.query.playlistId;
  
  console.log("hi")

  if (!playlistId) {
    return res.status(400).json({ error: "No playlist ID found" });
  }

  try {
    const api_key = process.env.YT_API_KEY; 
    
    if (!api_key) {
      return res.status(500).json({ error: "add an api key" });
    }  

    const [playlistMetaResponse, playlistResponse] = await Promise.all([
      axios.get("https://youtube.googleapis.com/youtube/v3/playlists", {
        params: { part: "snippet", id: playlistId, key: api_key }
      }),
      axios.get("https://youtube.googleapis.com/youtube/v3/playlistItems", {
        params: { part: "snippet", playlistId, maxResults: 50, key: api_key }
      })
    ]);
    

    const playlistMeta = playlistMetaResponse.data.items?.[0];
    const playlistTitle = playlistMeta?.snippet?.title || null;
    const playlistThumbnail = playlistMeta?.snippet?.thumbnails?.default?.url || null;

    const items = playlistResponse.data.items || []; // data bcz of axios, axios wraps resp in data, in that actual response is there 
    
    

    if (items.length === 0) {
      return res.json({
        playlist: { title: playlistTitle, thumbnail: playlistThumbnail },
        videos: [],
        totalSeconds: 0
      });
    }

    // we will batch multiple video id to avoid unneccessary wastage of units
    const videoIds = items
      ?.map(item => item.snippet?.resourceId?.videoId)
      ?.join(",") || "";

    if (!videoIds) {
      return res.json({
        playlist: { title: playlistTitle, thumbnail: playlistThumbnail },
        videos: [],
        totalSeconds: 0
      });
    }

    // for durations of each video id as its not avaialble in palylistitems api
    const videoResponse = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "contentDetails",
          id: videoIds,
          key: api_key,
        },
      }
    );

    const durationMap = {};
    videoResponse.data.items?.forEach(video => {
      durationMap[video.id] = video.contentDetails?.duration;
    });

   
    const result = items?.map(item => {
      const videoId = item.snippet?.resourceId?.videoId;

      return {
        title: item.snippet?.title,
        videoId: videoId,
        thumbnail: item.snippet?.thumbnails?.default?.url,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        duration: durationMap?.[videoId] || null
      };
    }) || [];

    // writing  logic for total seconds
    // getting seconds

    let sec  = 0;
    const list = videoResponse.data.items || []; 
    list.forEach(item => {
        const duration = item.contentDetails?.duration;
        sec += durationToSeconds(duration);
    });
    let obj = {
      playlist: { title: playlistTitle, thumbnail: playlistThumbnail },
      videos: result, // video's title, videoId, thumbnail, videoUrl, duration
      totalSeconds: sec
    };
    
    return res.json(obj);

  } catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    console.log("MESSAGE:", err.message);
    return res.status(500).json({ error: "Failed to fetch playlist" });
  }
};


/*
calling the YouTube Data API v3 three times:

playlists => gets playlist title + thumbnail
playlistItems => gets video list
videos => gets duration (ISO format like PT5M32S)

then merge everything into one clean response.




returns a single JSON object with two keys:

playlist
videos

json str
{
  playlist: {
    title: string | null,
    thumbnail: string | null
  },
  videos: [
    {
      title: string,
      thumbnail: string,
      videoUrl: string,
      duration: string | null
    }
  ]
}

*/