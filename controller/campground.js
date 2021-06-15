const express = require("express");
const CampGround = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.renderNewCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.renderShowCampground = async (req, res) => {
  const campground = await CampGround.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "campground not found !!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditCampground = async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  if (!campground) {
    req.flash("error", "campground not found !!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.putCampground = async (req, res) => {
  const campground = await CampGround.findByIdAndUpdate(
    req.params.id,
    req.body.campground
  );
  if (!campground) {
    req.flash("error", "campground not found !!");
    res.redirect("/campgrounds");
  }
  const images = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated a campground !");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await CampGround.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground !");
  res.redirect("/campgrounds");
};

module.exports.postCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new CampGround(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });
  campground.author = req.user._id;
  const data = await campground.save();
  req.flash("success", "Successfully created a campground !");
  res.redirect(`/campgrounds/${data._id}`);
};
module.exports.renderAllCampgrounds = async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
};
