const InitialCustomer = require('../model/InitialCustomer')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')


// @desc Get all initialCustomers
// @route GET /initialCustomers
// @access Private
const getAllInitialCustomers = asyncHandler(async (req, res) => {

    const initialCustomers = await InitialCustomer.find().lean()
    if (!initialCustomers?.length)
        return res.status(400).json({ message: 'BAD REQUEST : No initialCustomers found' })

    const initialCustomersWithUser = await Promise.all(initialCustomers.map(async (initialCustomer) => {
        const user = await User.findById(initialCustomer.userId).lean().exec()
        return { ...initialCustomer, username: user.username }
    }))

    res.json(initialCustomersWithUser)
})

// @desc Create new initialCustomer
// @route POST /initialCustomers
// @access Private
const createNewInitialCustomer = asyncHandler(async (req, res) => {

    const {
        userId,
        name,
        agentName,
        role,
        phoneNumber,
        introductionMethod
    } = req.body

    if (!userId || !name)
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })

    const duplicate = await InitialCustomer.findOne({ name }).lean().exec()
    if (duplicate)
        return res.status(409).json({ message: 'CONFLICT :Duplicate initialCustomer name' })

    const initialCustomer = await InitialCustomer.create({ userId, name, agentName, role, phoneNumber, introductionMethod })
    if (initialCustomer)
        return res.status(201).json({ message: `CREATED: InitialCustomer ${req.body.name} created successfully!` })
    else
        return res.status(400).json({ message: 'BAD REQUEST : Invalid initialCustomer data received' })
})


// @desc Update a initialCustomer
// @route PATCH /initialCustomers
// @access Private
const updateInitialCustomer = asyncHandler(async (req, res) => {

  const {
    id,
    userId,
    name,
    agentName,
    role,
    phoneNumber,
    introductionMethod
  } = req.body

  if (!id || !userId || !name )
    return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })

  const initialCustomer = await InitialCustomer.findById(id).exec()
  if(!initialCustomer) res.status(400).json({ message: 'BAD REQUEST : InitialCustomer not found' })

  const duplicate = await InitialCustomer.findOne({ name }).lean().exec()
  if(duplicate && duplicate?._id.toString() !== id)
    return res.status(409).json({ message: 'CONFLICT : Duplicate initialCustomer name!' })

  // Update and store user
  initialCustomer.userId = userId
  initialCustomer.name = name
  initialCustomer.agentName = agentName
  initialCustomer.role = role
  initialCustomer.phoneNumber = phoneNumber
  initialCustomer.introductionMethod = introductionMethod

  const updatedInitialCustomer = await initialCustomer.save()

  res.json(`'${updatedInitialCustomer.name}' updated`)
})

// @desc Delete a initialCustomer
// @route DELETE /initialCustomers
// @access Private
const deleteInitialCustomer = asyncHandler(async (req, res) => {

  const { id } = req.body
  if (!id)
    return res.status(400).json({ message: 'InitialCustomer ID required' })

  const initialCustomer = await InitialCustomer.findById(id).exec()
  if (!initialCustomer)
    return res.status(400).json({ message: 'InitialCustomer not found' })

  const result = await initialCustomer.deleteOne()
  const reply = `InitialCustomer '${result.name}' with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = {
    getAllInitialCustomers,
    createNewInitialCustomer,
    updateInitialCustomer,
    deleteInitialCustomer
}
