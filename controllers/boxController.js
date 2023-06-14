const Box = require('../model/Box')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all boxes 
// @route GET /boxes
// @access Private
const getAllBoxes = asyncHandler(async (req, res) => {

    const boxes = await Box.find().lean()
    if (!boxes?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No boxes found' })

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

    const { userId, name, type, duration, structures } = req.body
    if (!userId || !name || !type || !duration || !structures) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const duplicate = await Box.findOne({ name }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate box name' })

    const box = await Box.create({ userId, name, type, duration, structures })
    if (box) 
        return res.status(201).json({ message: `CREATED: Box ${req.body.name} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid box data received' })
})

// @desc Update a box
// @route PATCH /boxes
// @access Private
const updateBox = asyncHandler(async (req, res) => {

    const { id, userId, name, type, duration, structureIds } = req.body
    if (!id || !userId || !name || !type || !duration) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const box = await Box.findById(id).exec()
    if (!box) 
        return res.status(400).json({ message: 'BAD REQUEST : Box not found' })
    
    const duplicate = await Box.findOne({ name }).lean().exec()
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
    if (!id) 
        return res.status(400).json({ message: 'Box ID required' })
    
    const box = await Box.findById(id).exec()
    if (!box) 
        return res.status(400).json({ message: 'Box not found' })

    const result = await box.deleteOne()
    const reply = `Box '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = { getAllBoxes, createNewBox, updateBox, deleteBox }