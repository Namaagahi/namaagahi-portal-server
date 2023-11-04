const express = require("express")
const router = express.Router()
const initialCustomerController =  require('../controllers/initialCustomerController')

router.route('/')
    .get(initialCustomerController.getAllInitialCustomers)
    .post(initialCustomerController.createNewInitialCustomer)
    .patch(initialCustomerController.updateInitialCustomer)
    .delete(initialCustomerController.deleteInitialCustomer)

module.exports = router
