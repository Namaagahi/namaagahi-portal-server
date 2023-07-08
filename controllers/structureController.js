const Structure = require('../model/Structure')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')
const Box = require('../model/Box')

// @desc Get all structures 
// @route GET /structures
// @access Private
const getAllStructures = asyncHandler(async (req, res) => {

    const structures = await Structure.find().lean()
    if (!structures?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No structures found' })

    const structuresWithUser = await Promise.all(structures.map(async (structure) => {
        const user = await User.findById(structure.userId).lean().exec()
        return { ...structure, username: user.username }
    }))
    
    res.json(structuresWithUser)
})

// @desc Create new structure
// @route POST /structures
// @access Private
const createNewStructure = asyncHandler(async (req, res) => {

    const { userId, name, location } = req.body
    if (!userId || !name || !location ) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const duplicate = await Structure.findOne({ name }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate structure name' })

    const structure = await Structure.create({ userId, name, location })
    if (structure) 
        return res.status(201).json({ message: `CREATED: Structure ${req.body.name} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid box data received' })
})

// @desc Update a structure
// @route PATCH /structures
// @access Private
const updateStructure = asyncHandler(async (req, res) => {
    const { id, userId, name, location, isAvailable, isChosen, parent } = req.body
    if (!id || !userId || !name || !location || !parent ) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })

    const structure = await Structure.findById(id).exec()
    if(!structure) res.status(400).json({ message: 'BAD REQUEST : Structure not found' })

    const duplicate = await Structure.findOne({ name }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) 
        return res.status(409).json({ message: 'CONFLICT : Duplicate structure name!' })


     
    // Update and store user
    structure.userId = userId
    structure.name = name
    structure.location = location
    structure.isAvailable = isAvailable
    structure.isChosen = isChosen
    structure.parent = box.id

    const updatedStructure = await structure.save()

    res.json(`'${updatedStructure.sysCode}' updated`)
})

// @desc Delete a structure
// @route DELETE /structures
// @access Private
const deleteStructure = asyncHandler(async (req, res) => {

    const { id } = req.body
    if (!id) 
        return res.status(400).json({ message: 'Structure ID required' })
    
    const structure = await Structure.findById(id).exec()
    if (!structure) 
        return res.status(400).json({ message: 'Structure not found' })

    const result = await structure.deleteOne()
    const reply = `Structure '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = { getAllStructures, createNewStructure, updateStructure, deleteStructure }