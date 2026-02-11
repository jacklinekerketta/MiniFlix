import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Auth.css";
import { FcGoogle } from "react-icons/fc";
import bg from "../assets/Series.jpeg";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (isLogin) {
      const res = await api.post(
        "/auth/login",
        form
      );

      dispatch(setUser(res.data.user));

      navigate("/browse");
    } else {
      await api.post(
        "/auth/register",
        form
      );

      setIsLogin(true);
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
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          className="auth-btn"
          onClick={handleSubmit}
        >
          {isLogin
            ? "Sign In"
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
                  setIsLogin(false)
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
                  setIsLogin(true)
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
