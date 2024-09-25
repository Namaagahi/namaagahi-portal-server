const Location = require("../model/Location");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

// @desc Get all locations
// @route GET /locations
// @access Private
const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find().lean();
  if (!locations?.length)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : No locations found" });

  const locationsWithUser = await Promise.all(
    locations.map(async (location) => {
      const user = await User.findById(location.userId).lean().exec();
      return { ...location, username: user.username };
    })
  );

  res.json(locationsWithUser);
});

// @desc Create new location
// @route POST /locations
// @access Private
const createNewLocation = asyncHandler(async (req, res) => {
  const { userId, structureId, locationX, locationY, same } = req.body;
  if (!userId || !structureId || !locationX || !locationY)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const duplicate = await Location.findOne({ locationX }).lean().exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "CONFLICT :Duplicate location name" });

  const duplicateStr = await Location.findOne({ structureId }).lean().exec();
  if (duplicateStr)
    return res
      .status(409)
      .json({ message: "CONFLICT :Duplicate structure id" });

  const location = await Location.create({
    userId,
    structureId,
    locationX,
    locationY,
    same,
  });
  if (location)
    return res.status(201).json({
      message: `CREATED: Location ${req.body.name} created successfully!`,
    });
  else
    return res
      .status(400)
      .json({ message: "BAD REQUEST : Invalid location data received" });
});

// @desc Update a location
// @route PATCH /locations/:id
// @access Private
const updateLocation = asyncHandler(async (req, res) => {
  const { id, userId, structureId, locationX, locationY, same } = req.body;

  // Validate request body
  if (!id || !userId || !structureId || !locationX || !locationY) {
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });
  }

  // Check if location exists
  const location = await Location.findById(id).exec();
  if (!location) {
    return res.status(404).json({ message: "NOT FOUND: Location not found" });
  }

  // Check for duplicate location by locationX
  const duplicate = await Location.findOne({ locationX }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res
      .status(409)
      .json({ message: "CONFLICT : Duplicate location name" });
  }

  // Update the location fields
  location.userId = userId;
  location.structureId = structureId;
  location.locationX = locationX;
  location.locationY = locationY;
  location.same = same;

  const updatedLocation = await location.save();

  res.json({
    message: `UPDATED: Location ${updatedLocation.locationX} updated successfully!`,
  });
});

// @desc Delete a location
// @route DELETE /locations/:id
// @access Private
const deleteLocation = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Check if the location exists
  const location = await Location.findById(id).exec();
  if (!location) {
    return res.status(404).json({ message: "NOT FOUND: Location not found" });
  }

  await location.deleteOne();

  res.json({
    message: `DELETED: Location ${location.locationX} deleted successfully!`,
  });
});

module.exports = {
  getAllLocations,
  createNewLocation,
  updateLocation,
  deleteLocation,
};
