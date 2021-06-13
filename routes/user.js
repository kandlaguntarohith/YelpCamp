const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catch-error");
const user = require("../controller/user");

router.get("/register", catchError(user.renderRegister));
router.post("/register", catchError(user.register));
router.get("/login", user.renderLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  user.login
);
router.get("/logout", user.logout);
module.exports = router;
