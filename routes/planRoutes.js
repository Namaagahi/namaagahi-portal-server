const express = require("express");
const router = express.Router()
const planController =  require('../controllers/planController')
const verifyJWT = require('../middleware/virifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(planController.getAllPlans)
    .post(planController.createNewPlan)
    .patch(planController.updatePlan)
    .delete(planController.deletePlan)

module.exports = router  