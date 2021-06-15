const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: "60c4d9f518861f24883ccd86",
      geometry: {
        type: "Point",
        coordinates: [73.84778, 18.52361],
      },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum, nunc sed tempor ornare, tellus erat luctus sapien, a maximus libero purus quis velit. Fusce semper dolor suscipit, pretium risus ac, accumsan nulla. Etiam magna dolor, venenatis nec sapien vel, convallis dapibus mauris. Donec eu viverra est. Aliquam auctor hendrerit enim, vitae iaculis tellus fermentum at. Nunc eros nibh, rutrum quis est ut, malesuada suscipit sapien. In hac habitasse platea dictumst. Nullam tincidunt nunc metus, ut aliquam sapien interdum at.",
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/rohithreddy/image/upload/v1623663136/YelpCamp/aboh0uinl1fg7rv9othr.jpg",
          filename: "YelpCamp/aboh0uinl1fg7rv9othr",
        },
        {
          url: "https://res.cloudinary.com/rohithreddy/image/upload/v1623663136/YelpCamp/habkqa4tjpu6gljp6axo.jpg",
          filename: "YelpCamp/habkqa4tjpu6gljp6axo",
        },
        {
          url: "https://res.cloudinary.com/rohithreddy/image/upload/v1623663136/YelpCamp/zzkd0gb4x2rfvcnvzjg1.jpg",
          filename: "YelpCamp/zzkd0gb4x2rfvcnvzjg1",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
