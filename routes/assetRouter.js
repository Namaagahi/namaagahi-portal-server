const express = require("express");
const router = express.Router();
const itAssetController = require("../controllers/itAssetController");

router
  .route("/")
  .get(itAssetController.getAllAssets)
  .post(itAssetController.createNewAsset)
  .patch(itAssetController.updateAsset)
  .delete(itAssetController.deleteAsset);

module.exports = router;
