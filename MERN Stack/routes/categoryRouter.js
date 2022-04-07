const router = require('express').Router();
const categoryController = require('../controllers/CategoryController');
const authUser = require('../middleware/authUser');
const authAdmin = require('../middleware/authAdmin');
const auth = require('../middleware/authUser');


router.route('/category')
    .get(categoryController.getCategories)
    .post(authUser, authAdmin, categoryController.createCategory);

router.route('/category/:id')
    .delete(auth, authAdmin, categoryController.deleteCategory)
    .put(auth, authAdmin, categoryController.updateCategory);

module.exports = router;