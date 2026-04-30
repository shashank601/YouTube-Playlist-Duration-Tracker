import React, { useEffect, useState } from 'react'
import { mark, unmark } from '../../services/videosApi';

export function CheckboxButton({ isWatched, duration, videoId, playlistId, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const handleChange = async () => {
        if (loading) return;

        setLoading(true);

        try {
            if (isWatched) {
                await unmark(playlistId, videoId, duration);
            } else {
                await mark(playlistId, videoId, duration);
            }

            onSuccess(); //tell parent to re render, not state in ui  

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <input 
            className="cursor-pointer"
            type="checkbox"
            checked={!!isWatched}
            onChange={handleChange}
            disabled={loading}
        />
    );
}

