const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalController");

router
  .route("/")
  .get(proposalController.getAllProposals)
  .post(proposalController.createProposal)
  .patch(proposalController.updateProposal)
  .delete(proposalController.deleteProposal);

module.exports = router;
