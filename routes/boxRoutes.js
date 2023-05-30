const express = require("express");
const router = express.Router()
const boxController =  require('../controllers/boxController')
const verifyJWT = require('../middleware/virifyJWT')

router.route('/')
    .get(verifyJWT, boxController.getAllBoxes)
    .post(boxController.createNewBox)
    .put(boxController.editBox)
    .delete(boxController.deleteBox)

router.route('/:id').get(boxController.getSingleBox)

module.exports = router 