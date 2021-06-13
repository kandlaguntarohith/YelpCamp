const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const catchError = require("../utils/catch-error");
const ExpressError = require("../utils/express-error");

router.get(
  "/register",
  catchError(async (req, res, next) => {
    // next();
    res.render("user/register");
  })
);
router.post(
  "/register",
  catchError(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const newUser = await User.register(user, password);
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Successfully created a user !!");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);
router.get("/login", (req, res) => {
  res.render("user/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome, back");
    res.redirect("/campgrounds");
  }
);
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "GoodBye!");
  res.redirect("/campgrounds");
});
module.exports = router;
