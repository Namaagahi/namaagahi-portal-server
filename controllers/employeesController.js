const Employee = require('../model/Employee')

const getAllEmployees = async(req, res) => {
    const employees = await Employee.find()
    if(!employees) return res.status(204).json({ 'msg': 'NO CONTENT: No employees found!' })
    res.json(employees)
}

const createNewEmployee = async(req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) return res.status(400).json({ 'msg': 'BAD REQUEST: First and last names are required' })
    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })
        
        res.status(201).json({ 'msg': `CREATED: Employee ${req.body.firstname} created successfully!`  })
    } catch (error) {
        console.error(error)
    }
}

const editEmployee = async(req, res) => {
    if(!req?.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: id parameter is required' })

    const employee = await Employee.findOne({ _id: req.body.id }).exec()

    if(!employee) return res.status(201).json({ 'msg' : `NO CONTENT: No employee matches the id: ${req.body.id} ` }) 
    if(req.body?.firstname) employee.firstname = req.body.firstname 
    if(req.body?.lastname) employee.lastname = req.body.lastname 

    const result = await employee.save()
    console.log(result)

    res.status(201).json(result)
}

const deleteEmployee = async(req, res) => {
    if(!req.body?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Employee id required' })
    const employee =  await Employee.findOne({ _id: req.body.id }).exec()
    
    if(!employee) return res.status(201).json({ 'msg' : `NO CONTENT: No employee matches the id: ${req.body.id} ` }) 
    const result = await employee.deleteOne({ _id: req.body.id })

    res.status(201).json(result)
}

const getSingleEmployee = async(req, res) => {
    if(!req.params?.id) return res.status(400).json({ 'msg': 'BAD REQUEST: Employee id required' })
    const employee = await Employee.findOne({ _id: req.params.id }).exec()

    if(!employee) return res.status(201).json({ 'msg' : `NO CONTENT: No employee matches the id: ${req.params.id} ` }) 

    res.status(201).json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    editEmployee,
    deleteEmployee,
    getSingleEmployee,
} 