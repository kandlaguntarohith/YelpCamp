const express = require("express");
const router = express.Router({ mergeParams: true });
const CampGround = require("../models/campground");
const catchError = require("../utils/catch-error");
const ExpressError = require("../utils/express-error");
const { reviewSchema } = require("../joi-shemas");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchError(async (req, res, next) => {
    const campground = await CampGround.findById(req.params.id);
    if (!campground) {
      req.flash("error", "campground not found !!");
      res.redirect("/campgrounds");
    }
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully posted review !");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchError(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review !");
    res.redirect(`/campgrounds/${id}`);
  })
);
module.exports = router;
