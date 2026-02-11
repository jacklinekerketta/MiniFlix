import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Auth.css";
import { FcGoogle } from "react-icons/fc";
import bg from "../assets/Series.jpeg";

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] =
    useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] =
    useState({});
  const [serverError, setServerError] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  const switchMode = (nextIsLogin) => {
    setIsLogin(nextIsLogin);
    // Clear errors and server message when switching between
    // Sign In / Sign Up to avoid confusing stale messages.
    setErrors({});
    setServerError("");
    // Clear password for safety when changing mode.
    setForm((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setServerError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!isLogin && !form.name.trim()) {
      nextErrors.name =
        "Name is required.";
    }

    const trimmedEmail = form.email.trim();

    if (!trimmedEmail) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !emailRegex.test(trimmedEmail)
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password =
        "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors)
      .length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      if (isLogin) {
        const res = await api.post(
          "/auth/login",
          {
            email: form.email.trim(),
            password: form.password,
          }
        );

        // If backend doesn't return user details yet,
        // set a minimal user from email.
        const user =
          res.data.user ||
          res.data ||
          {
            email: form.email,
          };

        dispatch(setUser(user));
        navigate("/browse");
      } else {
        await api.post(
          "/auth/register",
          {
            ...form,
            name: form.name.trim(),
            email: form.email.trim(),
          }
        );

        switchMode(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.open(
      "http://localhost:5000/api/auth/google",
      "_self"
    );
  };

  return (
    <div
      className="auth"
      style={{
        background: `url(${bg}) center/cover no-repeat`,
      }}
    >
      <h1 className="logo">
        MINIFLIX
      </h1>

      <div className="auth-card">
        <h2>
          {isLogin
            ? "Sign In"
            : "Sign Up"}
        </h2>

        {!isLogin && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="auth-error">
                {errors.name}
              </p>
            )}
          </>
        )}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="auth-error">
            {errors.email}
          </p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="auth-error">
            {errors.password}
          </p>
        )}

        {serverError && (
          <p className="auth-error auth-error-server">
            {serverError}
          </p>
        )}

        <button
          className="auth-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {isLogin
            ? loading
              ? "Signing In..."
              : "Sign In"
            : loading
            ? "Signing Up..."
            : "Sign Up"}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          className="google-btn"
          onClick={googleLogin}
        >
          <FcGoogle />
          Sign in with Google
        </button>

        <p className="toggle">
          {isLogin ? (
            <>
              New to Miniflix?{" "}
              <span
                onClick={() =>
                  switchMode(false)
                }
              >
                Sign up now
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() =>
                  switchMode(true)
                }
              >
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
