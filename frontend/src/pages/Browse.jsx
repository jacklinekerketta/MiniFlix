import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Row from "../components/Row";
import { api } from "../services/api";

const Browse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const initialTag =
    searchParams.get("tag");
  const initialQuery =
    searchParams.get("q") || "";

  const [videos, setVideos] =
    useState([]);
  const [activeTag, setActiveTag] =
    useState(initialTag);
  const [searchTerm, setSearchTerm] =
    useState(initialQuery);

  useEffect(() => {
    api.get("/videos").then((res) =>
      setVideos(res.data)
    );
  }, []);

  const updateUrlFilters = (
    tag,
    search
  ) => {
    const params = {};
    if (tag) params.tag = tag;
    if (search && search.trim()) {
      params.q = search.trim();
    }
    setSearchParams(params, {
      replace: true,
    });
  };

  const handleSearchChange = (
    value
  ) => {
    setSearchTerm(value);
    updateUrlFilters(activeTag, value);
  };

  const handleSearchSubmit = (
    value
  ) => {
    const term = value
      .trim()
      .toLowerCase();
    if (!term) return;

    navigate(
      `/search?q=${encodeURIComponent(
        value.trim()
      )}`
    );
  };

  const handleTagClick = (tag) => {
    setActiveTag((prev) => {
      const next =
        prev === tag ? null : tag;
      updateUrlFilters(next, searchTerm);
      return next;
    });
  };

  const handleClearFilters = () => {
    setActiveTag(null);
    setSearchTerm("");
    setSearchParams(
      {},
      { replace: true }
    );
  };

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
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        searchValue={searchTerm}
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
              handleTagClick(tag)
            }
          >
            {tag}
          </span>
        ))}
      </div>

      {(activeTag ||
        searchTerm.trim()) && (
        <button
          className="clear-filters-btn"
          onClick={handleClearFilters}
        >
          Clear all filters
        </button>
      )}

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
