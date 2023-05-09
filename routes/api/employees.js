const express = require("express");
const router = express.Router()
const employeesController =  require('../../controllers/employeesController')
const verifyJWT = require('../../middleware/virifyJWT')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyJWT, employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.MediaManager), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.MediaManager), employeesController.editEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)

router.route('/:id').get(employeesController.getSingleEmployee)

module.exports = router