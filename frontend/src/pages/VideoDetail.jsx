import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import "../styles/Browse.css";

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/videos/${id}`)
      .then((res) => setVideo(res.data))
      .catch((err) => {
        console.error("Failed to load video", err);
      });
  }, [id]);

  if (!video) {
    return (
      <div className="browse">
        <Navbar />
      </div>
    );
  }

  const backdrop =
    video.banner_url || video.thumbnail_url;

  return (
    <div className="browse">
      <Navbar />

      <div
        className="video-detail-backdrop"
        style={{
          backgroundImage: `url(${backdrop})`,
        }}
      >
        <div className="video-detail-overlay">
          <div className="video-detail-modal">
            <button
              className="detail-close"
              onClick={() => navigate(-1)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="video-detail-left">
              <img
                src={
                  video.banner_url ||
                  video.thumbnail_url
                }
                alt={video.title}
              />
            </div>

            <div className="video-detail-right">
              <h1>{video.title}</h1>

              <p className="video-meta">
                {video.category &&
                  `${video.category} • `}
                {video.duration ||
                  "Duration N/A"}
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

              <p className="video-detail-desc">
                {video.description}
              </p>

              <div className="hero-buttons">
                <button
                  className="play-btn"
                  onClick={() => {
                    if (!video.hls_manifest_url)
                      return;
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
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;

