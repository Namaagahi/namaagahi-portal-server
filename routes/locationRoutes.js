const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router
  .route("/")
  .get(locationController.getAllLocations)
  .post(locationController.createNewLocation)
  .patch(locationController.updateLocation)
  .delete(locationController.deleteLocation);

module.exports = router;
