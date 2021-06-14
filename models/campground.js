const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

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
module.exports = mongoose.model("campground", campGroundSchema);
