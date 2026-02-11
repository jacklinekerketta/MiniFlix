import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { api } from "../services/api";
import { logoutUser } from "../features/auth/authSlice";
import "../styles/Browse.css";

const Navbar = ({
  onSearchChange,
  onSearchSubmit,
  searchValue,
}) => {
  const [internalQuery, setInternalQuery] =
    useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const query =
    searchValue ?? internalQuery;

  const handleChange = (e) => {
    const value = e.target.value;

    if (searchValue === undefined) {
      setInternalQuery(value);
    }

    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      onSearchSubmit
    ) {
      onSearchSubmit(query);
    }
  };

  const handleLogout = async () => {
    try {
      // Tell the server to destroy the session cookie
      await api.get("/auth/logout");
    } catch (err) {
      // Even if the request fails (e.g. network), still clear local state
      console.error("Logout failed", err);
    } finally {
      // Clear Redux auth state and send user back to auth screen
      dispatch(logoutUser());
      navigate("/");
    }
  };

  return (
    <div className="navbar">
      {/* LEFT SIDE */}
      <div className="nav-left">
        <h1 className="logo">
          MINIFLIX
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        {/* Search (right side) */}
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search by title or tag..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
