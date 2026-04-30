// we render all tracked playlists here

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPlaylists } from "../services/playlistApi";
import { DelPlaylistButton } from "../components/buttons/delPlaylistButton";
import { formatDuration } from "../utils/helper";
export default function TrackedPlaylists() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await getUserPlaylists();
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const onDelete = (playlistId) => {
    const newData = data.filter(
      (playlist) => playlist.playlist_id !== playlistId,
    );
    setData(newData);
  };
  if (loading) {
    return <h1>loading...</h1>;
  }

  return (
    <>
      <h1 className="text-gray-500 mb-4"> Tracked Playlists </h1>

      {data.length > 0 ? (
        data.map((playlist) => (
          <div key={playlist.playlist_id} className="flex flex-col gap-2 border border-2 border-gray-200 border-b-zinc-900 border-r-zinc-900 p-4 mb-4" >
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() => navigate(`/myprogress/${playlist.playlist_id}`)}
            >
              <img src={playlist.thumbnail} className="w-48" />
              
              <div className="flex flex-col gap-0">
                <span className="text-zinc-900 font-mono overflow-x-auto whitespace-nowrap w-50 text-lg">
                  {playlist.title}
                </span>
                <h1>
                  <span className="text-gray-500 ">Total Watched: </span>
                  {formatDuration(playlist.watched_duration_seconds)}
                </h1>
                <h1>
                  <span className="text-gray-500 ">Total Duration: </span>
                  {formatDuration(playlist.totalSeconds)}
                </h1>
                <div className="flex items-center gap-2">
                  <progress
                    value={Number(playlist.watched_duration_seconds)}
                    max={playlist.totalSeconds}
                  />
                  <span className="text-end">
                    {`${Math.round((playlist.watched_duration_seconds / playlist.totalSeconds) * 100)}%`}
                  </span>
                </div>
              </div>
            </div>

            
            <div className="flex items-center gap-2">

              <DelPlaylistButton
                playlistId={playlist.playlist_id}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))
      ) : (
        <h1>No playlist found</h1>
      )}
    </>
  );
}

/*
    [{
      "thumbnail": "https://i.ytimg.com/vi/q6IEA26hvXc/mqdefault.jpg"
      "title": "HARD",
      "playlist_id": "PLot-Xpze53letfIu9dMzIIO7na_sqvl0w",
      "watched_duration_seconds": "0",
    }],


    updated response:
      {
        "thumbnail": "https://i.ytimg.com/vi/q6IEA26hvXc/mqdefault.jpg"
        "title": "HARD",
        "playlist_id": "PLot-Xpze53letfIu9dMzIIO7na_sqvl0w",
        "watched_duration_seconds": "0",
        "totalSeconds": 45539  <-- added
    }
*/
