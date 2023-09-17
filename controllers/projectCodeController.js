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
    
    if (!userId || !media || !finalCustomerId) 
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


// @desc Update a finalCustomer
// @route PATCH /finalCustomers
// @access Private
const updateProjectCode = asyncHandler(async (req, res) => {

    const {
        id,
        userId,
        media,
        year,
        finalCustomerId,
        brand,
        desc,
        code
    } = req.body

    if (!userId || !finalCustomerId || !brand || !year ) 
        return res.status(400).json({ 
            success: false, 
            message: 'BAD REQUEST : fields are required' 
        })
  
    const projectCode = await ProjectCode.findById(id)

    if (!projectCode) 
      return res.status(400).json({ 
        success: false, 
        message: 'BAD REQUEST : Project Code not found' 
    })
      
    projectCode.userId = userId
    projectCode.media = media
    projectCode.year = year
    projectCode.finalCustomerId = finalCustomerId
    projectCode.brand = brand
    projectCode.desc = desc
  
    const duplicate = await ProjectCode.findOne({ code }).lean().exec()
    if (duplicate  && duplicate.code.toString() !== code) 
        return res.status(409).json({ 
            success: false, 
            message: 'CONFLICT :Duplicate Project Code id' 
        })

    await projectCode.save()
  
    res.status(200).json({ 
        success: true, 
        message: `UPDATED: Project Code ${projectCode.code} updated successfully!` 
    })
})

// @desc Delete a projectCode
// @route DELETE /projectCode
// @access Private
const deleteProjectCode = asyncHandler(async (req, res) => {

    const { id } = req.body
    if (!id) 
        return res.status(400).json({ message: 'Project Code ID required' })
    
    const projectCode = await ProjectCode.findById(id).exec()
    if (!projectCode) 
        return res.status(400).json({ message: 'Project Code not found' })

    const result = await projectCode.deleteOne()
    const reply = `Project Code '${result.code}' with ID ${result._id} deleted`

    res.json(reply)
})


module.exports = {
    getAllProjectCodes,
    createNewProjectCode,
    updateProjectCode,
    deleteProjectCode
}
