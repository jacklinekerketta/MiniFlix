import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import VideoPlayer from "../components/VideoPlayer";
import { api } from "../services/api";
import "../styles/Browse.css";

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [manifestUrl, setManifestUrl] =
    useState(null);
  const [showOverlay, setShowOverlay] =
    useState(true);

  useEffect(() => {
    if (!id) return;

    // 1) Public metadata (no manifest URL inside)
    api
      .get(`/videos/${id}`)
      .then((res) => setVideo(res.data))
      .catch((err) => {
        console.error("Failed to load video", err);
      });

    // 2) Protected manifest endpoint – requires auth/session
    api
      .get(`/videos/${id}/manifest`)
      .then((res) =>
        setManifestUrl(res.data.manifestUrl)
      )
      .catch((err) => {
        if (err.response?.status === 401) {
          // Not authenticated – send user back to auth flow
          navigate("/");
        } else {
          console.error(
            "Failed to load manifest",
            err
          );
        }
      });
  }, [id, navigate]);

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
              {manifestUrl ? (
                <>
                  <VideoPlayer
                    ref={playerRef}
                    src={manifestUrl}
                  />

                  {showOverlay && (
                    <button
                      type="button"
                      className="detail-poster-wrapper"
                      onClick={() => {
                        if (!manifestUrl)
                          return;
                        setShowOverlay(false);
                        if (playerRef.current) {
                          playerRef.current.play?.();
                        }
                      }}
                    >
                      <img
                        className="detail-poster-image"
                        src={
                          video.banner_url ||
                          video.thumbnail_url
                        }
                        alt={video.title}
                      />

                      <div className="detail-poster-overlay">
                        <div className="detail-play-button">
                          <span className="detail-play-icon">
                            ▶
                          </span>
                          <span className="detail-play-label">
                            Play
                          </span>
                        </div>
                      </div>
                    </button>
                  )}
                </>
              ) : (
                <img
                  className="detail-poster-image"
                  src={
                    video.banner_url ||
                    video.thumbnail_url
                  }
                  alt={video.title}
                />
              )}
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
                        onClick={() =>
                          navigate(
                            `/browse?tag=${encodeURIComponent(
                              tag
                            )}`
                          )
                        }
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}

              <p className="video-detail-desc">
                {video.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;

