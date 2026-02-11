import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, // session cookies
});

// If the API is completely unreachable or returns
// a 5xx error, show a friendly error page instead
// of leaving the user on a broken screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const isServerError =
      status && status >= 500;
    const isNetworkError =
      !error.response;

    if (
      (isServerError || isNetworkError) &&
      window.location.pathname !== "/error"
    ) {
      window.location.href = "/error";
    }

    return Promise.reject(error);
  }
);

