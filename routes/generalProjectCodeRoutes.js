const express = require("express");
const router = express.Router();
const generalProjectCodeController = require("../controllers/generalProjectCodeController");

router
  .route("/")
  .get(generalProjectCodeController.getAllGeneralProjectCodes)
  .post(generalProjectCodeController.createNewGeneralProjectCode)
  .patch(generalProjectCodeController.updateGeneralProjectCode)
  .delete(generalProjectCodeController.deleteGeneralProjectCode);

module.exports = router;
