import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Browse.css";

const Hero = () => {
  const [video, setVideo] =
    useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/videos").then((res) => {
      setVideo(res.data[0]);
    });
  }, []);

  if (!video) return null;

  const handlePlay = () => {
    if (!video.id) return;
    // Reuse the same HLS-based detail player as the rest of the app
    navigate(`/video/${video.id}`);
  };

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${video.banner_url})`,
      }}
    >
      <div className="hero-content">
        <h1>{video.title}</h1>
        <p>
          {video.description}
        </p>

        {video.tags && (
          <div className="hero-tags">
            {video.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="hero-tag"
                >
                  {tag}
                </span>
              ))}
          </div>
        )}

        <div className="hero-buttons">
          <button
            className="play-btn"
            onClick={handlePlay}
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
