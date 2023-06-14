const express = require('express')
const router = express.Router()
const structureController = require('../controllers/structureController')
const verifyJWT = require('../middleware/virifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(structureController.getAllStructures)
    .post(structureController.createNewStructure)
    .patch(structureController.updateStructure)
    .delete(structureController.deleteStructure)

module.exports = router