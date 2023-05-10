const express = require("express");
const router = express.Router()
const packageController =  require('../../controllers/packageController')
const verifyJWT = require('../../middleware/virifyJWT')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyJWT, packageController.getAllPackages)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.MediaManager), packageController.createNewPackage)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.MediaManager), packageController.editPackage)
    .delete(verifyRoles(ROLES_LIST.Admin), packageController.deletePackage)

router.route('/:id').get(packageController.getSinglePackage)

module.exports = router 