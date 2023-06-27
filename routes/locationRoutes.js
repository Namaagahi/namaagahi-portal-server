const express = require("express");
const router = express.Router()
const locationController =  require('../controllers/locationController');
const verifyJWT = require("../middleware/virifyJWT");

router.use(verifyJWT)

router.route('/')
    .get(locationController.getAllLocations)
    .post(locationController.createNewLocation)
    // .put(boxController.updateBox)
    // .delete(boxController.deleteBox)

module.exports = router 