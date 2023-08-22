const express = require("express");
const router = express.Router()
const initialCustomerController =  require('../controllers/initialCustomerController')
// const verifyJWT = require('../middleware/virifyJWT')

// router.use(verifyJWT)

router.route('/')
    .get(initialCustomerController.getAllInitialCustomers)
    .post(initialCustomerController.createNewInitialCustomer)
    .delete(initialCustomerController.deleteInitialCustomer)

module.exports = router  