const express = require("express");
const router = express.Router()
const boxController =  require('../controllers/boxController')
const verifyJWT = require('../middleware/virifyJWT')

router.route('/')
    .get(verifyJWT, boxController.getAllBoxes)
    .post(boxController.createNewBox)
    .put(boxController.updateBox)
    .delete(boxController.deleteBox)

module.exports = router 