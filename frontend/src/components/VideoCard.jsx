import { useNavigate } from "react-router-dom";
import "../styles/Browse.css";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!video?.id) return;
    navigate(`/video/${video.id}`);
  };

  return (
    <div
      className="video-card"
      onClick={handleClick}
    >
      <img
        src={video.thumbnail_url}
        alt={video.title}
        className="video-thumb"
      />

      <div className="card-title">
        {video.title}
      </div>

      <div className="card-overlay">
        <div className="card-overlay-content">
          <p>{video.description}</p>
        </div>
      </div>

    </div>
  );
};

export default VideoCard;
