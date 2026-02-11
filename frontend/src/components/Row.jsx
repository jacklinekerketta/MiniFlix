import VideoCard from "./VideoCard";
import "../styles/Browse.css";

const Row = ({ title, videos }) => {
  return (
    <div className="row">
      <h2 className="row-title">
        {title}
      </h2>

      <div className="row-posters">
        {videos.map((v) => (
          <VideoCard
            key={v.id}
            video={v}
          />
        ))}
      </div>
    </div>
  );
};

export default Row;
