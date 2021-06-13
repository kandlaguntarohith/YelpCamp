const express = require("express");
const router = express.Router();
const CampGround = require("../models/campground");
const catchError = require("../utils/catch-error");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controller/campground");
const campground = require("../models/campground");

router.get("/new", isLoggedIn, campgrounds.renderNewCampground);
router.get("/:id", catchError(campgrounds.renderShowCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchError(campgrounds.renderEditCampground)
);
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground, //middleware
  catchError(campgrounds.putCampground)
);
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchError(campgrounds.deleteCampground)
);
router.post(
  "/",
  isLoggedIn,
  validateCampground, //middleware
  catchError(campgrounds.postCampground)
);
router.get("/", catchError(campgrounds.renderAllCampgrounds));

module.exports = router;
