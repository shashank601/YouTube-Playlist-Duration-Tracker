import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchPlaylist } from '../services/playlistApi';
import PlaylistInfo from '../components/cards/playlistInfo';
import VideoInfo from '../components/cards/videoInfo';
import AddPlaylistButton from '../components/buttons/addPlaylistButton';


export default function PlaylistDetail() {
  const resStr = {
    playlist: {
      title: "",
      thumbnail: ""
    },
    videos: []
  };
  
  const navigate = useNavigate();
  const [res, setRes] = useState(resStr);
  const [loading, setLoading] = useState(true);

  const {playlistId} = useParams();
  if (!playlistId) return <div>No playlist mentioned</div>;

  useEffect(() => {
    setLoading(true);
    searchPlaylist(playlistId)
      .then(resp => {
        setRes(resp.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        console.log("maybe invalid input")
        navigate('/');
        setLoading(false);
      });
  }, [playlistId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zinc-900"></div>
      </div>
    );
  } else {
    return(
      <div>
        <div className="flex flex-row mt-2 mb-4 justify-between items-center  border-b-2 border-r-2 border-zinc-700 bg-slate-200 ">
          <PlaylistInfo playlist={res.playlist} totalSeconds={res.totalSeconds} />
          <AddPlaylistButton playlistId={playlistId} title={res.playlist.title} />
        </div>
      
        
        {
          res.videos && res.videos.map(video => (
            <VideoInfo key={video.videoId} video={video} />
          ))
        }
      </div>
    )

  }
}

//to embed js in jsx use {}

// res.playlist  this have title

// 