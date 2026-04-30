// we render all videos of a tracked playlist here
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistProgress } from "../services/videosApi";
import { CheckboxButton } from "../components/buttons/checkboxButton";
import { parseDuration, formatDuration } from "../utils/helper";

export default function TrackedVideos() {
  const { playlistId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylistProgress = async () => {
    try {
      // {videos: [{thumbanialURL,duration,isWatched,URL, videoId}], totalSec, totalWatchedSeconds}
      setLoading(true);
      const response = await getPlaylistProgress(playlistId);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistProgress();
  }, [playlistId]);

  if (!data) {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zinc-900"></div>
        </div>
      );
    }
    return <h1>Something went wrong</h1>;
  }
  console.log(data);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-black">
            <span className="text-gray-500">Total Duration: </span>
            {formatDuration(data.totalSec)}
          </h1>

          <div>
            <h1>
              <span className="text-gray-500">Total Watched: </span>
              {formatDuration(data.totalWatchedSeconds)}
            </h1>
          </div>
          <h1 className="my-2 text-white bg-green-600 font-semibold rounded-sm px-2 py-1">
            Progress:{" "}
            <span className="text-black font-bold animate-pulse">
              {`${Math.round((data.totalWatchedSeconds / data.totalSec) * 100)}%`}
            </span>
          </h1>
        </div>
      </div>

      <progress
        className="w-full h-4 bg-white sticky top-10"
        value={data.totalWatchedSeconds}
        max={data.totalSec}
      />

      {data.videos.map((video) => (
        <div
          key={video.videoId}
          className=" flex items-center justify-between gap-4 mb-1 border- border-t border-zinc-800"
        >
          <img src={video.thumbnailURL} alt={video.videoId} />

          <div className="flex flex-col mb-2 hover:text-blue-500 w-full">
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              className="font-mono"
            >
              {video.title}
            </a>
            <span className="text-xs bg-zinc-900 rounded px-2 py-1 text-slate-100 w-fit">
              {parseDuration(video.duration)}
            </span>
          </div>

          <CheckboxButton
            key={video.videoId}
            isWatched={video.isWatched}
            duration={video.duration}
            videoId={video.videoId}
            playlistId={playlistId}
            onSuccess={fetchPlaylistProgress}
          />
        </div>
      ))}
    </>
  );
}

/*
<h1 className="text-gray-500">
              Progress:{" "}
              <span className="text-black">
                {`${Math.round((data.totalWatchedSeconds / data.totalSec) * 100)}%`}
              </span>
            </h1>

*/
