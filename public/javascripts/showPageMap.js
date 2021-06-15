mapboxgl.accessToken = mapToken;
// console.log(campground)
const goodCampground = JSON.parse(campground);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/navigation-day-v1",
  center: goodCampground.geometry.coordinates,
  zoom: 7, // starting zoom
});

// Set options
var marker = new mapboxgl.Marker({
  color: "#4B0082",
  // draggable: true,
})
  .setLngLat(goodCampground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${goodCampground.title}</h4><p>${goodCampground.location}</p>`
    )
  )
  .addTo(map);
