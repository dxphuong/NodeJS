const router = require('express').Router();
const userController = require('../controllers/UserController');
const auth = require('../middleware/authUser');

router.post('/register', userController.register); //đăng kí 

router.post('/login', userController.login); //đăng nhập

router.get('/logout', userController.logout); //đăng xuất

router.get('/refresh_token', userController.refreshToken); //tạo mới token

router.get('/infor', auth, userController.getUser); //lấy thông tin của user

router.patch('/addcart', auth, userController.addCart); //thêm vào giỏ hàng

router.get('/history', auth, userController.history); //Xem lịch sử mua hàng




module.exports = router;