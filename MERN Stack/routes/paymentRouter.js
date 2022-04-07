const router = require('express').Router()
const paymentCtrl = require('../controllers/PaymentController')
const authUser = require('../middleware/authUser')
const authAdmin = require('../middleware/authAdmin')


router.route('/payment')
    .get(authUser, authAdmin, paymentCtrl.getPayments)
    .post(authUser, paymentCtrl.createPayment)
module.exports = router