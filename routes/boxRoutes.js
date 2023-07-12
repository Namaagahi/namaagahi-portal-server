const express = require("express");
const router = express.Router()
const boxController =  require('../controllers/boxController')
const verifyJWT = require('../middleware/virifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(boxController.getAllBoxes)
    .post(boxController.createNewBox)
    .patch(boxController.updateBox)
    .delete(boxController.deleteBox)

module.exports = router 