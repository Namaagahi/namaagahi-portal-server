const express = require("express");
const router = express.Router()
const planController =  require('../../controllers/planController')
const verifyJWT = require('../../middleware/virifyJWT')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(verifyJWT, planController.getAllPlans)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.MediaManager, ROLES_LIST.Planner), planController.createNewPlan)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.MediaManager, ROLES_LIST.Planner), planController.editPlan)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.MediaManager, ROLES_LIST.Planner), planController.deletePlan)

router.route('/:id').get(planController.getSinglePlan)

module.exports = router 