import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/Browse.css";

const Hero = () => {
  const [video, setVideo] =
    useState(null);

  useEffect(() => {
    api.get("/videos").then((res) => {
      setVideo(res.data[0]);
    });
  }, []);

  if (!video) return null;

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
            onClick={() => {
              if (!video.hls_manifest_url) return;
              // Open the HLS manifest URL in a new tab/window
              window.open(
                video.hls_manifest_url,
                "_blank"
              );
            }}
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
