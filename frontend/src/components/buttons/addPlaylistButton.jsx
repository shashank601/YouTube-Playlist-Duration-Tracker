import React from 'react';
import { addPlaylist } from '../../services/playlistApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export function AddPlaylistButton ({playlistId, title}) {
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const addHandler = async () => {
        setLoading(true);
        try {
            await addPlaylist(playlistId, title);
        } catch (err) {
            navigate('/login')
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button className="bg-zinc-900 text-[#F3F4F4] transition-colors h-8 px-4 mr-5 "  onClick={addHandler} disabled={loading}>
            Track
        </button>
    );
};

export default AddPlaylistButton;