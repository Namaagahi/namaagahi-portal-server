const Structure = require('../model/Structure')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all structures 
// @route GET /structures
// @access Private
const getAllStructures = asyncHandler(async (req, res) => {

    const structures = await Structure.find().lean()
    if (!structures?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No structures found' })

    const structuresWithUser = await Promise.all(structures.map(async (structure) => {
        const user = await User.findById(structure.user).lean().exec()
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
    const { 
        id,
        user, 
        sysCode,
        kind,
        district,
        path,
        address,
        style,
        face,
        dimensions,
        printSize,
        docSize,
        isAvailable  } = req.body

    // Confirm data
    if ( !id
        || !user  
        || !sysCode
        || !kind
        || !district
        || !path
        || !address
        || !style
        || !face
        || !dimensions
        || !printSize
        || !docSize
        || typeof isAvailable !== 'boolean'
        ) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    // Confirm structure exists to update
    const structure = await Structure.findById(id).exec()
    if (!structure) return res.status(400).json({ message: 'BAD REQUEST : Structure not found' })
    
    // Check for duplicate system code
    const duplicate = await Structure.findOne({ sysCode }).lean().exec()
    // Allow renaming of the original structure 
    if (duplicate && duplicate?._id.toString() !== id) 
        return res.status(409).json({ message: 'CONFLICT : Duplicate structure system code!' })
    
        structure.user = user
        structure.sysCode = sysCode
        structure.kind = kind
        structure.district = district
        structure.path = path
        structure.address = address
        structure.style = style
        structure.face = face
        structure.dimensions = dimensions
        structure.printSize = printSize
        structure.docSize = docSize
        structure.isAvailable = isAvailable

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