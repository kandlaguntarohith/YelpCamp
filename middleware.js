module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You Must be Signed in");
    return res.redirect("/login");
  }
  next();
};
