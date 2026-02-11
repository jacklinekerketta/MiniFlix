import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import VideoDetail from "./pages/VideoDetail";
import SearchResults from "./pages/SearchResults";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Auth />}
        />

        <Route
          path="/browse"
          element={<Browse />}
        />

        <Route
          path="/video/:id"
          element={<VideoDetail />}
        />

        <Route
          path="/search"
          element={<SearchResults />}
        />

        <Route
          path="/error"
          element={<ErrorPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
