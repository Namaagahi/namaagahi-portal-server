const Structure = require('../model/Structure')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all structures 
// @route GET /structures
// @access Private
const getAllStructures = asyncHandler(async (req, res) => {

    const structures = await Structure.find().lean()
    if (!structures?.length) return res.status(400).json({ message: 'BAD REQUEST : No structures found' })

    const structuresWithUser = await Promise.all(structures.map(async (structure) => {
        console.log('structure', structure)
        const user = await User.findById(structure.user).lean().exec()
        return { ...structure, username: user.username }
    }))

    res.json(structuresWithUser)
})

// @desc Create new structure
// @route POST /structures
// @access Private
const createNewStructure = asyncHandler(async (req, res) => {

    const { userId, name, type, duration, location, costs } = req.body
    if (!userId || !name || !type || !duration || !location || !costs  ) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const duplicate = await Structure.findOne({ name }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate structure name' })

    const structure = await Structure.create({ userId, name, type, duration, location, costs })
    if (structure) 
        return res.status(201).json({ message: `CREATED: Structure ${req.body.name} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid box data received' })
})
// const createNewStructure = asyncHandler(async (req, res) => {
//     const { 
//         user, 
//         sysCode,
//         kind,
//         district,
//         path,
//         address,
//         style,
//         face,
//         dimensions,
//         printSize,
//         docSize,
//         isAvailable 
//     } = req.body

//     // Confirm data
//     if (!user  
//         || !sysCode
//         || !kind
//         || !district
//         || !path
//         || !address
//         || !style
//         || !face
//         || !dimensions
//         || !printSize
//         || !docSize) return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
//     // Check for duplicate title
//     const duplicate = await Structure.findOne({ sysCode }).lean().exec()
//     if (duplicate) return res.status(409).json({ message: 'CONFLICT :Duplicate structure system code!' })
    
//     // Create and store the new structure 
//     const structure = await Structure.create({ user, 
//         sysCode,
//         kind,
//         district,
//         path,
//         address,
//         style,
//         face,
//         dimensions,
//         printSize,
//         docSize,
//         isAvailable  })

//     if (structure) return res.status(201).json({ message: 'CREATED : New structure created' })
//     else return res.status(400).json({ message: 'BAD REQUEST : Invalid structure data received' })
// })

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

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Structure ID required' })
    }

    // Confirm structure exists to delete 
    const structure = await Structure.findById(id).exec()

    if (!structure) {
        return res.status(400).json({ message: 'Structure not found' })
    }

    const result = await structure.deleteOne()

    const reply = `Structure '${result.sysCode}' with ID ${result._id} deleted`

    res.json(reply)
})

// @desc Get a structure
// @route GET /structures
// @access Private
const getStructure = asyncHandler(async (req, res) => {
    const thisStructure = await Structure.findOne({ _id: req.id }).exec()
    if(!thisStructure) return res.status(204).json({ message: `NO CONTENT: Structure ID ${req.id} not found` })
    res.status(200).json(thisStructure)
})

module.exports = {
    getAllStructures,
    createNewStructure,
    updateStructure,
    deleteStructure,
    getStructure
}