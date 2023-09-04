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

    const {
        userId,
        finalCustomerId,
        name,
        contractType,
        customerType,
        agent,
        nationalId,
        ecoCode,
        regNum,
        address,
        postalCode,
        phone
    } = req.body

    if (!userId || !finalCustomerId || !name || !nationalId ) 
        return res.status(400).json({ message: 'BAD REQUEST : company name and nationalId are required' })
    
    const duplicate = await FinalCustomer.findOne({ nationalId }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate finalCustomer nationalId' })

    const finalCustomer = await FinalCustomer.create({
        userId,
        finalCustomerId,
        name,
        contractType,
        customerType,
        agent,
        nationalId,
        ecoCode,
        regNum,
        address,
        postalCode,
        phone
    })

    if (finalCustomer) 
        return res.status(201).json({ message: `CREATED: FinalCustomer ${req.body.name} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid finalCustomer data received' })
})

// @desc Update a finalCustomer
// @route PATCH /finalCustomers
// @access Private
const updateFinalCustomer = asyncHandler(async (req, res) => {

    const {
        id,
        userId,
        finalCustomerId,
        name,
        contractType,
        customerType,
        agent,
        nationalId,
        ecoCode,
        regNum,
        address,
        postalCode,
        phone
    } = req.body

    if (!userId || !finalCustomerId || !name || !nationalId ) 
        return res.status(400).json({ message: 'BAD REQUEST : company name and nationalId are required' })
  
    const finalCustomer = await FinalCustomer.findByIdAndUpdate(
        id,
        {
            name,
            contractType,
            customerType,
            agent,
            nationalId,
            ecoCode,
            regNum,
            address,
            postalCode,
            phone
        },
        { new: true }
    )

    if (!finalCustomer) 
      return res.status(400).json({ message: 'BAD REQUEST : FinalCustomer not found' })
  
    const duplicate = await FinalCustomer.findOne({ nationalId }).lean().exec()
    if (duplicate  && duplicate._id.toString() !== id) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate finalCustomer nationalId' })
  
    res.status(200).json({ message: `UPDATED: Final customer ${finalCustomer.name} updated successfully!` })
  })

// @desc Delete a finalCustomer
// @route DELETE /finalCustomers
// @access Private
const deleteFinalCustomer = asyncHandler(async (req, res) => {

    const { id } = req.body
    
    if (!id) 
        return res.status(400).json({ message: 'FinalCustomer ID required' })
    
    const finalCustomer = await FinalCustomer.findByIdAndDelete(id)
    
    if (!finalCustomer) 
        return res.status(400).json({ message: 'FinalCustomer not found' })

    res.status(200).json({ message: `DELETED: Final customer ${finalCustomer.name} deleted successfully!` })
})

module.exports = {
    getAllFinalCustomers,
    updateFinalCustomer,
    createNewFinalCustomer,
    deleteFinalCustomer
}