const express = require("express");
const router = express.Router()
const registerController = require('../../controllers/registerController')
const verifyRoles = require("../../middleware/verifyRoles")
const ROLES_LIST = require('../../config/roles_list')


router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin), registerController.handleNewUser)

module.exports = router 