const Location = require('../model/Location')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all locations 
// @route GET /locations
// @access Private
const getAllLocations = asyncHandler(async (req, res) => {

    const locations = await Location.find().lean()
    if (!locations?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No locations found' })

    const locationsWithUser = await Promise.all(locations.map(async (location) => {
        const user = await User.findById(location.userId).lean().exec()
        return { ...location, username: user.username }
    }))

    res.json(locationsWithUser)
})


// @desc Create new location
// @route POST /locations
// @access Private
const createNewLocation = asyncHandler(async (req, res) => {

    const { userId, structureId, locationX, locationY, same } = req.body
    if (!userId || !structureId || !locationX || !locationY) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const duplicate = await Location.findOne({ locationX }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate location name' })

    const location = await Location.create({ userId, structureId, locationX, locationY, same })
    if (location) 
        return res.status(201).json({ message: `CREATED: Location ${req.body.name} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid location data received' })
})

module.exports = { getAllLocations, createNewLocation }