import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(""); // loacl state for input

  const searchHandler = () => {
    try {
      const parsed = new URL(query); // thrown an exepction on invalid url so we should  ad try catch
      const playlistId = parsed.searchParams.get("list");
      if (!playlistId) throw new Error("invalid url");
      navigate(`/${playlistId}`);
    } catch {
      console.log("inavlid url");
      return null;
    }
  };
  return (
    <div className="flex gap-1 justify-center">
      <input
        type="text"
        placeholder="Drop playlist link"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
					bg-dark-gray
					text-bright-gray
					border border-light-gray/40
					px-3 py-2
					rounded-md
					outline-none
					focus:border-bright-gray/60
				"
      />
      <button
        onClick={searchHandler}
        className="
					bg-green-600
					text-white
					px-4 py-2
					rounded-md
					hover:bg-green-700
					transition-colors
				"
      >
        Search
      </button>
    </div>
  );
}
