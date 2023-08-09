const express = require("express");
const router = express.Router()
const finalCustomerController =  require('../controllers/finalCustomerController')
const verifyJWT = require('../middleware/virifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(finalCustomerController.getAllFinalCustomers)
    .post(finalCustomerController.createNewFinalCustomer)
    .delete(finalCustomerController.deleteFinalCustomer)

module.exports = router  