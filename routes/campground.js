const express = require("express");
const router = express.Router();
const CampGround = require("../models/campground");
const catchError = require("../utils/catch-error");
const ExpressError = require("../utils/express-error");
const { campgroundSchema } = require("../joi-shemas");
const { isLoggedIn } = require("../middleware");
const validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.get(
  "/:id",
  catchError(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "campground not found !!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchError(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    if (!campground) {
      req.flash("error", "campground not found !!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  validateCampground, //middleware
  catchError(async (req, res) => {
    const campground = await CampGround.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    if (!campground) {
      req.flash("error", "campground not found !!");
      res.redirect("/campgrounds");
    }
    req.flash("success", "Successfully updated a campground !");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
router.delete(
  "/:id",
  isLoggedIn,
  catchError(async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted campground !");
    res.redirect("/campgrounds");
  })
);
router.post(
  "/",
  isLoggedIn,
  validateCampground, //middleware
  catchError(async (req, res) => {
    const camp = new CampGround(req.body.campground);
    const data = await camp.save();
    req.flash("success", "Successfully created a campground !");
    res.redirect(`/campgrounds/${data._id}`);
  })
);
router.get(
  "/",
  catchError(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

module.exports = router;
