const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const CampGround = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchError = require("./utils/catch-error");
const ExpressError = require("./utils/express-error");
const { campgroundSchema, reviewSchema } = require("./joi-shemas");
const Review = require("./models/review");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//==========================================================
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected !");
});
//==========================================================

const validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("//", (req, res) => {
  res.render("home.ejs");
});
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  catchError(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate(
      "reviews"
    );
    console.log(campground);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchError(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
app.put(
  "/campgrounds/:id",
  validateCampground, //middleware
  catchError(async (req, res) => {
    const campground = await CampGround.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
app.delete(
  "/campgrounds/:id",
  catchError(async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);
app.post(
  "/campgrounds",
  validateCampground, //middleware
  catchError(async (req, res) => {
    // if (!req.body.campground)
    //   throw new ExpressError("campground Data Missing !", 404);

    const camp = new CampGround(req.body.campground);
    const data = await camp.save();
    res.redirect(`/campgrounds/${data._id}`);
  })
);
app.get(
  "/campgrounds",
  catchError(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchError(async (req, res, next) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchError(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found !!", 404));
});
app.use((error, req, res, next) => {
  const { message = "something went wrong !", statusCode = 500 } = error;
  res.status(statusCode).render("errorpage", { message });
});
app.listen(3000, () => {
  console.log("Server Running on Port : 3000");
});
