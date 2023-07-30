const Plan = require('../model/Plan')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all plans 
// @route GET /plans
// @access Private
const getAllPlans = asyncHandler(async (req, res) => {

    const plans = await Plan.find().lean()
    if (!plans?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No plans found' })

    const plansWithUser = await Promise.all(plans.map(async (plan) => {
        const user = await User.findById(plan.userId).lean().exec()
        return { ...plan, username: user.username }
    }))

    res.json(plansWithUser)
})

// @desc Create new plan
// @route POST /plans
// @access Private
const createNewPlan = asyncHandler(async (req, res) => {

    const { planId, userId, name, customerName, brand, structures } = req.body
    if (!userId || !name || !customerName || !brand || !structures) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const duplicate = await Plan.findOne({ name }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate plan name' })

    const plan = await Plan.create({ planId, userId, name, customerName, brand, structures  })
    if (plan) 
        return res.status(201).json({ message: `CREATED: Plan ${req.body.name} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid plan data received' })
})

// @desc Update a plan
// @route PATCH /planes
// @access Private
const updatePlan = asyncHandler(async (req, res) => {

    const { id, planId, userId, username, name, customerName, brand, structures } = req.body
    if (!id || !planId || !userId || !username || !name || !customerName || !brand || !username) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const plan = await Plan.findById(id).exec()
    if (!plan) 
        return res.status(400).json({ message: 'BAD REQUEST : Plan not found' })
    
    const duplicate = await Plan.findOne({ name }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) 
        return res.status(409).json({ message: 'CONFLICT : Duplicate plan name' })
    
    plan.userId = userId
    plan.username = username
    plan.planId = planId
    plan.name = name
    plan.customerName = customerName
    plan.brand = brand
    plan.structures = structures

    const updatedPlan = await plan.save()

    res.json(`'${updatedPlan.name}' updated`)
})

// @desc Delete a plan
// @route DELETE /plans
// @access Private
const deletePlan = asyncHandler(async (req, res) => {

    const { id } = req.body
    if (!id) 
        return res.status(400).json({ message: 'Plan ID required' })
    
    const plan = await Plan.findById(id).exec()
    if (!plan) 
        return res.status(400).json({ message: 'Plan not found' })

    const result = await plan.deleteOne()
    const reply = `Plan '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
})
module.exports = { getAllPlans, createNewPlan, updatePlan, deletePlan }
