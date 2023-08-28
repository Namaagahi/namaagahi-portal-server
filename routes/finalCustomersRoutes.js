const express = require("express");
const router = express.Router()
const finalCustomerController =  require('../controllers/finalCustomerController')

router.route('/')
    .get(finalCustomerController.getAllFinalCustomers)
    .post(finalCustomerController.createNewFinalCustomer)
    .patch(finalCustomerController.updateFinalCustomer)
    .delete(finalCustomerController.deleteFinalCustomer)

module.exports = router  