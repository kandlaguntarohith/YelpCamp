const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary/index");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campGroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
campGroundSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

campGroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews) {
    await Review.deleteMany({
      _id: { $in: campground.reviews },
    });
  }
  if (campground.images) {
    for (const img of campground.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});
module.exports = mongoose.model("campground", campGroundSchema);
