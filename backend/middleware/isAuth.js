export const isAuth = (req, res, next) => {
  // Session-based auth (email/password login)
  if (req.session && req.session.userId) {
    return next();
  }

  // Passport-based auth (e.g. Google OAuth)
  if (req.user && req.user.id) {
    // Normalize into the same session field the rest of the app uses
    req.session.userId = req.user.id;
    return next();
  }

  return res.status(401).json("Unauthorized");
};
