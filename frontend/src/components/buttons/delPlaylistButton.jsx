import React from 'react'
import { deletePlaylist } from '../../services/playlistApi';


export function DelPlaylistButton ({playlistId, onDelete}) { // onDelete notify parent to remove that item
    const [loading, setLoading] = React.useState(false);

    const delHandler = async () => {
        setLoading(true);
        try {
            await deletePlaylist(playlistId);
            onDelete(playlistId); // inform parent
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button onClick={delHandler} disabled={loading} className="bg-zinc-900 text-[#F3F4F4] hover:text-zinc-300 h-8 px-4 mr-5">
            {loading ? 'Deleting...' : 'Delete'}
        </button>
    );
}
