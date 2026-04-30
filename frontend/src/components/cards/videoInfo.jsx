import React from 'react';
import { parseDuration } from '../../utils/helper';


export default function VideoInfo({video}) {
  return (
    <div className="flex items-center gap-4 mb-1 border- border-t border-zinc-800">

      <img src={video.thumbnail}  />

      <div className="flex flex-col mb-2 hover:text-blue-500">

        <a href={video.videoUrl} className="font-mono">{video.title}</a>
        <span className="text-xs bg-zinc-900 rounded px-2 py-1 text-slate-100 w-fit">{parseDuration(video.duration)}</span>
        
      </div>
      
    </div>
  );
}

/*
{
  
  "videos": [
    {
      "title": "string",
      "videoId": "string",
      "thumbnail": "string",
      "videoUrl": "string",
      "duration": "string"
    }
  ]
}
*/