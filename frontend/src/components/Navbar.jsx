import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../styles/Browse.css";

const Navbar = ({ onSearchChange }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleLogout = () => {
    // Clear session / redux later
    navigate("/");
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
