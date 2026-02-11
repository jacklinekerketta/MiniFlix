import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Row from "../components/Row";
import { api } from "../services/api";

const TAGS = [
  "Sci‑Fi",
  "Fantasy",
  "Action",
  "Comedy",
  "Drama",
];

const Browse = () => {
  const [videos, setVideos] =
    useState([]);
  const [activeTag, setActiveTag] =
    useState(null);
  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    api.get("/videos").then((res) =>
      setVideos(res.data)
    );
  }, []);

  const matchesSearch = (video) => {
    const term = searchTerm
      .trim()
      .toLowerCase();
    if (!term) return true;

    const inTitle = video.title
      ?.toLowerCase()
      .includes(term);

    const inTags = (video.tags || "")
      .toLowerCase()
      .includes(term);

    return inTitle || inTags;
  };

  const getByTag = (tag, list) =>
    (list || videos).filter((v) => {
      if (!v.tags) return false;
      return v.tags
        .split(",")
        .map((t) => t.trim())
        .includes(tag);
    });

  // Derive available tags from all videos (keeps banner tags in sync with DB)
  const tags = useMemo(() => {
    const set = new Set();

    videos.forEach((v) => {
      if (!v.tags) return;

      v.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => set.add(t));
    });

    return Array.from(set);
  }, [videos]);

  const visibleVideos =
    videos.filter(matchesSearch);

  return (
    <div className="browse">
      <Navbar
        onSearchChange={setSearchTerm}
      />
      <Hero />

      <div className="genre-tags">
        {tags.map((tag) => (
          <span
            key={tag}
            className={
              "genre-tag" +
              (activeTag === tag
                ? " active"
                : "")
            }
            onClick={() =>
              setActiveTag(
                (prev) =>
                  prev === tag
                    ? null
                    : tag
              )
            }
          >
            {tag}
          </span>
        ))}
      </div>

      {activeTag && (
        <Row
          title={activeTag}
          videos={getByTag(
            activeTag,
            visibleVideos
          )}
        />
      )}

      <Row
        title="Popular on MiniFlix"
        videos={visibleVideos}
      />
    </div>
  );
};

export default Browse;
