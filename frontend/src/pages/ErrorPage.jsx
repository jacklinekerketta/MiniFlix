import "../styles/Browse.css";

const ErrorPage = () => {
  return (
    <div className="browse error-page">
      <div className="error-card">
        <h1>Something went wrong</h1>
        <p>
          We’re having trouble talking to the
          MiniFlix servers right now.
        </p>
        <p className="error-subtext">
          Please check your connection or try
          again in a moment.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;

