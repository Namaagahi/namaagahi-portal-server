const FinalCustomer = require('../model/FinalCustomer')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all finalCustomers 
// @route GET /finalCustomers
// @access Private
const getAllFinalCustomers = asyncHandler(async (req, res) => {

    const finalCustomers = await FinalCustomer.find().lean()
    if (!finalCustomers?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No finalCustomers found' })

    const finalCustomersWithUser = await Promise.all(finalCustomers.map(async (finalCustomer) => {
        const user = await User.findById(finalCustomer.userId).lean().exec()
        return { ...finalCustomer, username: user.username }
    }))

    res.json(finalCustomersWithUser)
})

// @desc Create new finalCustomer
// @route POST /finalCustomers
// @access Private
const createNewFinalCustomer = asyncHandler(async (req, res) => {

    const { userId, finalCustomerId, agentName, companyName, post, ecoCode, regNum, nationalId, address, phone, postalCode } = req.body
    if (!userId || !companyName || !ecoCode || !finalCustomerId) 
        return res.status(400).json({ message: 'BAD REQUEST : company name and ecoCode is required' })
    
    const duplicate = await FinalCustomer.findOne({ ecoCode }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate finalCustomer eco code' })

    const finalCustomer = await FinalCustomer.create({ userId, finalCustomerId, agentName, companyName, post, ecoCode, regNum, nationalId, address, phone, postalCode })
    if (finalCustomer) 
        return res.status(201).json({ message: `CREATED: FinalCustomer ${req.body.companyName} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid finalCustomer data received' })
})

// @desc Update a finalCustomer
// @route PATCH /finalCustomers
// @access Private
const updateFinalCustomer = asyncHandler(async (req, res) => {

    const { id, userId, username, finalCustomerId, agentName, companyName, post, ecoCode, regNum, nationalId, address, phone, postalCode } = req.body

    if (!userId || !companyName || !ecoCode || !finalCustomerId) 
        return res.status(400).json({ message: 'BAD REQUEST : company name and ecoCode is required' })
  
    const finalCustomer = await FinalCustomer.findById(id).exec();
    if (!finalCustomer) {
      return res.status(400).json({ message: 'BAD REQUEST : FinalCustomer not found' });
    }
  
    const duplicate = await FinalCustomer.findOne({ ecoCode }).lean().exec()
    if (duplicate  && duplicate._id.toString() !== id) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate finalCustomer eco code' })
  
    finalCustomer.userId = userId
    finalCustomer.username = username
    finalCustomer.finalCustomerId = finalCustomerId
    finalCustomer.agentName = agentName
    finalCustomer.companyName = companyName
    finalCustomer.post = post
    finalCustomer.ecoCode = ecoCode
    finalCustomer.regNum = regNum
    finalCustomer.nationalId = nationalId
    finalCustomer.address = address
    finalCustomer.phone = phone
    finalCustomer.postalCode = postalCode
  
    const updatedFinalCustomer = await finalCustomer.save()
  
    res.json(`'${updatedFinalCustomer.companyName}' updated`)
  })

// @desc Delete a finalCustomer
// @route DELETE /finalCustomers
// @access Private
const deleteFinalCustomer = asyncHandler(async (req, res) => {

    const { id } = req.body
    
    if (!id) 
        return res.status(400).json({ message: 'FinalCustomer ID required' })
    
    const finalCustomer = await FinalCustomer.findById(id).exec()
    if (!finalCustomer) 
        return res.status(400).json({ message: 'FinalCustomer not found' })

    const result = await finalCustomer.deleteOne()
    const reply = `FinalCustomer '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = { getAllFinalCustomers, updateFinalCustomer, createNewFinalCustomer, deleteFinalCustomer }

