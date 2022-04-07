const router = require('express').Router();

const productController = require('../controllers/ProductController');
const auth = require('../middleware/authUser');
const authAdmin = require('../middleware/authAdmin');


router.route('/products')
    .get(productController.getProducts)
    .post(auth, authAdmin, productController.createProduct)


router.route('/products/:id')
    .delete(auth, authAdmin, productController.deleteProduct)
    .put(productController.updateProduct)



module.exports = router;