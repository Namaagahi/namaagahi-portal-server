const ProjectCode = require('../model/ProjectCode')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')

// @desc Get all projectCodes 
// @route GET /projectCodes
// @access Private
const getAllProjectCodes = asyncHandler(async (req, res) => {

    const projectCodes = await ProjectCode.find().lean()
    if (!projectCodes?.length) 
        return res.status(400).json({ message: 'BAD REQUEST : No project codes found' })

    const projectCodesWithUser = await Promise.all(projectCodes.map(async (projectCode) => {
        const user = await User.findById(projectCode.userId).lean().exec()
        return { ...projectCode, username: user.username }
    }))

    res.json(projectCodesWithUser)
})

// @desc Create new projectCode
// @route POST /projectCodes
// @access Private
const createNewProjectCode = asyncHandler(async (req, res) => {

    const {
        userId,
        media,
        year,
        finalCustomerId,
        brand,
        desc,
        code
    } = req.body
    
    if (!userId || !media || !year || !finalCustomerId) 
        return res.status(400).json({ message: 'BAD REQUEST : All fields are required' })
    
    const duplicate = await ProjectCode.findOne({ code }).lean().exec()
    if (duplicate) 
        return res.status(409).json({ message: 'CONFLICT :Duplicate project code id' })

    const projectCode = await ProjectCode.create({ userId, media, year, finalCustomerId, brand, desc, code  })
    if (projectCode) 
        return res.status(201).json({ message: `CREATED: Project code ${req.body.code} created successfully!` })
    else 
        return res.status(400).json({ message: 'BAD REQUEST : Invalid project code data received' })
})

module.exports = {
    getAllProjectCodes,
    createNewProjectCode
}
