import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Row from "../components/Row";
import { api } from "../services/api";
import "../styles/Browse.css";

const SearchResults = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();
  const queryParam =
    searchParams.get("q") || "";

  const [query, setQuery] =
    useState(queryParam);
  const [results, setResults] =
    useState([]);

  useEffect(() => {
    const term = queryParam
      .trim()
      .toLowerCase();

    if (!term) {
      setResults([]);
      return;
    }

    api
      .get("/videos/search", {
        params: { q: queryParam },
      })
      .then((res) =>
        setResults(res.data)
      )
      .catch((err) => {
        console.error(
          "Search failed",
          err
        );
      });
  }, [queryParam]);

  const handleSearchChange = (
    value
  ) => {
    setQuery(value);
  };

  const handleSearchSubmit = (
    value
  ) => {
    const term = value
      .trim()
      .toLowerCase();

    if (!term) {
      setSearchParams({});
      setResults([]);
      return;
    }

    setSearchParams({
      q: value.trim(),
    });
  };

  return (
    <div className="browse">
      <Navbar
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        searchValue={query}
      />

      {queryParam ? (
        <Row
          title={`Search results for "${queryParam}"`}
          videos={results}
        />
      ) : (
        <div className="row">
          <h2 className="row-title">
            Type a title or tag and
            press Enter to search
          </h2>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

