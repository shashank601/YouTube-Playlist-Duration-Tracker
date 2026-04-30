import React from 'react';
import { formatDuration } from '../../utils/helper';

export default function PlaylistInfo({ playlist, totalSeconds }) {

  return (
    <div className="flex items-center gap-4 justify-between ">
      <img src={playlist.thumbnail}  />
      <div className="flex flex-col justify-start">
        <h1 className="text-black text-l font-semibold">{playlist.title}</h1>
        <h1 className="text-black"><span className="text-gray-500">Total duration:</span> {formatDuration(totalSeconds)}</h1>
      </div>
      
    </div>
  );
}

/*
"playlist": {
    "title": "string",
    "thumbnail": "string"
  },
*/