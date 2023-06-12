const Box = require('../model/Box')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all boxes 
// @route GET /boxes
// @access Private
const getAllBoxes = asyncHandler(async (req, res) => {
    // Get all boxes from MongoDB
    const boxes = await Box.find().lean()

    // If no boxes 
    if (!boxes?.length) return res.status(400).json({ message: 'BAD REQUEST : No boxes found' })
    // Add username to each box before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const boxesWithUser = await Promise.all(boxes.map(async (box) => {
        const user = await User.findById(box.userId).lean().exec()
        return { ...box, username: user.username }
    }))
    res.json(boxesWithUser)
})

// @desc Create new box
// @route POST /boxes
// @access Private
const createNewBox = asyncHandler(async (req, res) => {
    const { userId, name, type, duration, structureIds } = req.body

    // Confirm data
    if (!userId || !name || !type || !duration  ) return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    // Check for duplicate name
    const duplicate = await Box.findOne({ name }).lean().exec()
    if (duplicate) return res.status(409).json({ message: 'CONFLICT :Duplicate box name' })
    
    // Create and store the new user 
    const box = await Box.create({ userId, name, type, duration, structureIds })

    if (box) return res.status(201).json({ message: `CREATED: Box ${req.body.name} created successfully!` })
    else return res.status(400).json({ message: 'BAD REQUEST : Invalid box data received' })
})

// @desc Update a box
// @route PATCH /boxes
// @access Private
const updateBox = asyncHandler(async (req, res) => {
    const { id, userId, name, type, duration, structureIds } = req.body

    // Confirm data
    if (!id || !userId || !name || !type || !duration) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    // Confirm box exists to update
    const box = await Box.findById(id).exec()
    if (!box) return res.status(400).json({ message: 'BAD REQUEST : Box not found' })
    
    // Check for duplicate name
    const duplicate = await Box.findOne({ name }).lean().exec()
    // Allow renaming of the original box 
    if (duplicate && duplicate?._id.toString() !== id) 
        return res.status(409).json({ message: 'CONFLICT : Duplicate box name' })
    
    box.userId = userId
    box.name = name
    box.type = type
    box.duration = duration
    box.structureIds = structureIds

    const updatedBox = await box.save()

    res.json(`'${updatedBox.name}' updated`)
})

// @desc Delete a box
// @route DELETE /boxes
// @access Private
const deleteBox = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Box ID required' })
    }

    // Confirm box exists to delete 
    const box = await Box.findById(id).exec()

    if (!box) {
        return res.status(400).json({ message: 'Box not found' })
    }

    const result = await box.deleteOne()

    const reply = `Box '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
})

// @desc Get a box
// @route GET /boxes
// @access Private
const getBox = asyncHandler(async (req, res) => {
    const thisBox = await Box.findOne({ _id: req.params.id }).exec()
    if(!thisBox) return res.status(204).json({ message: `NO CONTENT: Box ID ${req.params.id} not found` })
    res.status(200).json(thisBox)
})

// const getSingleBox = async(req, res) => {
//     if(!req.params?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Box id required' })
//     const thisBox = await Box.findOne({ _id: req.params.id }).exec()

//     if(!thisBox) return res.status(201).json({ 'msg' : `NO CONTENT: No box matches the id: ${req.params.id} ` }) 

//     res.status(201).json(thisBox)
// }

module.exports = {
     getAllBoxes,
     createNewBox,
     updateBox,
     deleteBox,
     getBox,
}