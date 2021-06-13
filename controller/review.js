const CampGround = require("../models/campground");
const Review = require("../models/review");

module.exports.postReview = async (req, res, next) => {
  const campground = await CampGround.findById(req.params.id);
  if (!campground) {
    req.flash("error", "campground not found !!");
    res.redirect("/campgrounds");
  }
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully posted review !");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await CampGround.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review !");
  res.redirect(`/campgrounds/${id}`);
};
