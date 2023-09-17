const express = require("express");
const router = express.Router()
const projectCodeController =  require('../controllers/projectCodeController')

router.route('/')
    .get(projectCodeController.getAllProjectCodes)
    .post(projectCodeController.createNewProjectCode)
    .patch(projectCodeController.updateProjectCode)
    .delete(projectCodeController.deleteProjectCode)

module.exports = router  