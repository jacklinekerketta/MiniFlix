import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import VideoDetail from "./pages/VideoDetail";

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
      </Routes>
    </Router>
  );
}

export default App;
