const express = require("express");
const router = express.Router();
const CampGround = require("../models/campground");
const catchError = require("../utils/catch-error");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controller/campground");
const campground = require("../models/campground");

router
  .route("/")
  .post(
    isLoggedIn,
    validateCampground, //middleware
    catchError(campgrounds.postCampground)
  )
  .get(catchError(campgrounds.renderAllCampgrounds));
router.get("/new", isLoggedIn, campgrounds.renderNewCampground);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchError(campgrounds.renderEditCampground)
);

router
  .route("/:id")
  .get(catchError(campgrounds.renderShowCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchError(campgrounds.putCampground)
  )
  .delete(isLoggedIn, isAuthor, catchError(campgrounds.deleteCampground));

module.exports = router;
