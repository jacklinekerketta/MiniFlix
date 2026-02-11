import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const name = profile.displayName;
      const email = profile.emails[0].value;

      db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, results) => {
          if (results.length > 0) {
            return done(null, results[0]);
          } else {
            db.query(
              "INSERT INTO users (name,email,oauth_provider) VALUES (?,?,?)",
              [name, email, "google"],
              (err, result) => {
                done(null, {
                  id: result.insertId,
                  name,
                  email,
                });
              }
            );
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    (err, results) => {

      if (err) return done(err);

      // 🔒 Safety check
      if (!results || results.length === 0) {
        return done(null, false);
      }

      done(null, results[0]);
    }
  );
});

