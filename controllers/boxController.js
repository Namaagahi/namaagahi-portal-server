const Box = require('../model/Box')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')
const Structure = require('../model/Structure')

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

  const {
    boxId,
    userId,
    name,
    mark,
    duration,
    structures
  } = req.body

  if (!boxId || !userId || !name || !mark || !duration || !structures)
    return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })

  const duplicate = await Box.findOne({ name }).lean().exec()
  if (duplicate)
    return res.status(409).json({ message: 'CONFLICT :Duplicate box name' })

  const box = await Box.create({
    boxId,
    userId,
    name,
    mark,
    duration,
    structures
  })

  if (box) {
    await updateStructures(structures, box.boxId, true)

    return res.status(201).json({ message: `CREATED: Box ${req.body.name} created successfully!` })
  } else {
      return res.status(400).json({ message: 'BAD REQUEST: Invalid box data received' })
  }
})

// @desc Update a box
// @route PATCH /boxes
// @access Private
const updateBox = asyncHandler(async (req, res) => {

  const {
    id,
    boxId,
    userId,
    username,
    name,
    mark,
    duration,
    structures
  } = req.body

  if (!id || !boxId || !userId || !name || !mark || !duration || !username)
    return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })

  const box = await Box.findById(id).exec()

  if (!box)
    return res.status(400).json({ message: 'BAD REQUEST : Box not found' })

  const duplicate = await Box.findOne({ name }).lean().exec()

  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json({ message: 'CONFLICT : Duplicate box name' })

  box.userId = userId
  box.username = username
  box.boxId = boxId
  box.name = name
  box.mark = mark
  box.duration = duration
  box.structures = structures

  // Update structures
  await updateStructures(structures, box.boxId, false)
  await box.save()

  res.json(`'${box.name}' updated`)
})

// @desc Delete a box
// @route DELETE /boxes
// @access Private
const deleteBox = asyncHandler(async (req, res) => {

  const {
    id,
    boxId
  } = req.body

  await updateStructuresOnBoxDeletion(boxId)

  if (!id || !boxId)
    return res.status(400).json({ message: 'Box ID required' })

  const box = await Box.findById(id).exec()
  if (!box)
    return res.status(400).json({ message: 'Box not found' })

  const result = await box.deleteOne()
  const reply = `Box '${result.name}' with ID ${result._id} deleted`

  res.json(reply)
})

// @desc Get a single box by ID
// @route GET /boxes/:id
// @access Private
const getBoxById = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!id)
    return res.status(400).json({ message: 'Box ID required' })

  const box = await Box.findById(id).lean().exec()

  if (!box)
    return res.status(404).json({ message: 'Box not found' })

  const user = await User.findById(box.userId).lean().exec()
  const boxWithUser = { ...box, username: user.username }

  res.json(boxWithUser)
})

// @desc update box structures when create or update
// @middleware
// @access Private
async function updateStructures(structures, boxId, isCreation) {

  const updatedStructures = []

  for (const structure of structures) {
    const structureId = structure.structureId
    const foundStructure = await Structure.findOne({ _id: structureId }).exec()
    if (foundStructure) {
      foundStructure.isChosen = true
      foundStructure.parent = boxId
      await foundStructure.save()
      updatedStructures.push(foundStructure)
    }
  }

  if (!isCreation) {
    const removedStructures = await Structure.find({
      _id: { $nin: structures.map(s => s.structureId) },
      parent: boxId
    }).exec()
    for (const structure of removedStructures) {
      structure.isChosen = false
      structure.parent = ''
      await structure.save()
    }
  }

  return updatedStructures
}

// @desc update box structures when delete
// @middleware
// @access Private
async function updateStructuresOnBoxDeletion(boxId) {

  const updatedStructures = await Structure.updateMany(
    { parent: boxId },
    { $set: { isChosen: false, parent: '' } }
  ).exec()

  return updatedStructures
}

module.exports = {
  getAllBoxes,
  createNewBox,
  updateBox,
  deleteBox,
  getBoxById
}
