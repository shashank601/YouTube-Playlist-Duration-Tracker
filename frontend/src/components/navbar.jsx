import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { removeToken } from "../utils/token";
import { useState, useEffect } from "react";
import { healthCheck } from "../services/playlistApi";

export function Navbar() {
  const { user, setUser } = useAuth(); // get user directly from auth context
  const [isHome, setIsHome] = useState(false);
  const [healthStatus, setHealthStatus] = useState(true);

  useEffect(() => {
    const testHealth = async () => {
    try {
      const response = await healthCheck();

      if (response.data.status === "ok") {
        setHealthStatus(true);
      } else {
        setHealthStatus(false);
      }
    } catch (error) {
      console.error("Health check failed:", error);
      setHealthStatus(false);
    }
  };
    testHealth();
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between p-2 bg-white text-white">
      <div className="flex items-center gap-8">
        <span className="text-lg text-[#2c4cd1] font-bold">
          <span className="text-red-500">YT</span>{" "}
          <span className="text-zinc-900">Playlist Duration Tracker </span>
        </span>
        {healthStatus ? (
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping"></div>
            <div className="relative w-4 h-4 rounded-full bg-green-500"></div>
          </div>
        ) : (
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>
            <div className="relative w-4 h-4 rounded-full bg-red-500"></div>
          </div>
        )}
      </div>

      {!user ? (
        <div className="flex items-center gap-4 ">
          <Link to="/login" className="text-zinc-900 ">
            Login
          </Link>
          <Link to="/register" className="text-zinc-900 ">
            Register
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {isHome ? (
            <Link
              to="/"
              className="text-zinc-900 "
              onClick={() => setIsHome(false)}
            >
              Home
            </Link>
          ) : (
            <Link
              to="/myprogress"
              className="text-zinc-900 "
              onClick={() => setIsHome(true)}
            >
              Library
            </Link>
          )}

          <button
            className="cursor-pointer text-zinc-900"
            onClick={() => {
              removeToken();
              setUser(null);
            }}
          >
            logout
          </button>
        </div>
      )}
    </nav>
  );
}
