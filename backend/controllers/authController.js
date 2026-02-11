import bcrypt from "bcrypt";
import { db } from "../config/db.js";

// REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "User exists" });

      res.json({ message: "Registered" });
    }
  );
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {
      if (results.length === 0)
        return res.status(400).json("User not found");

      const user = results[0];

      const match = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!match)
        return res.status(400).json("Wrong password");

      req.session.userId = user.id;

      res.json({ message: "Login success" });
    }
  );
};

// LOGOUT
export const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
};

// CURRENT USER
export const me = (req, res) => {
  if (!req.session.userId)
    return res.status(401).json("Unauthorized");

  res.json({ userId: req.session.userId });
};
