const express = require('express')
const router = express.Router()
const proposalController = require('../controllers/proposalController')

router.route('/')
    .get(proposalController.getAllProposals)
    .post(proposalController.createProposal)
    // .patch(proposalController.updateStructure)
    // .delete(proposalController.deleteStructure)

module.exports = router
