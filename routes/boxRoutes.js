const express = require("express");
const router = express.Router()
const boxController =  require('../controllers/boxController')

router.route('/')
    .get(boxController.getAllBoxes)
    .post(boxController.createNewBox)
    .patch(boxController.updateBox)
    .delete(boxController.deleteBox)

router.route("/:id")
  .get(boxController.getBoxById);


module.exports = router  