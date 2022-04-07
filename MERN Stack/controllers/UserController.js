const { response } = require('express');
const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const Payments = require('../models/paymentModel');


const userController = {
    register: async(req, res) => {
        try {
            const { name, email, password, address, phone } = req.body;
            const user = await Users.findOne({ email });

            if (user) return res.status(400).json({ msg: "The email already exit !!!" });
            if (password.length < 6) return res.status(400).json({ msg: "Password is at least 6 characters long !!!" });
            const passwordCrypt = await bcrypt.hash(password, 3); //Mã hóa pass

            const newUser = new Users({
                name,
                email,
                password: passwordCrypt,
                address,
                phone
            });

            //luu vao database
            await newUser.save();

            //tao jsonwebtoken de chung thuc
            const token = createToken({ id: newUser._id });
            const refreshtoken = createRefeshToken({ id: newUser._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });

            res.json({ msg: "Register Success!", token });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    login: async(req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email });
            if (!user) return res.status(400).json({ msg: "User does not exit!" });

            const isUser = await bcrypt.compare(password, user.password);
            if (!isUser) return res.status(400).json({ msg: "Incorrect password!" });

            //dang nhap thanh cong tao token va refresh token
            const token = createToken({ id: user._id });
            const refreshtoken = createRefeshToken({ id: user._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            });
            res.json({ msg: "Login success!", token });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    logout: async(req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
            return res.json({ msg: "Logged out!" })
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    refreshToken: (req, res) => {
        try {
            const refresh_token = req.cookies.refreshtoken;

            if (!refresh_token) return res.status(400).json({ msg: "Please Login or Register!" });

            jsonwebtoken.verify(refresh_token, process.env.REFRESH_TOKEN, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register!" });

                const token = createToken({ id: user.id });
                res.json({ token })
            });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getUser: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password'); //Lấy tất cả trừ pass

            if (!user) return res.status(500).json({ msg: "User does not exit!!" });

            res.json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    addCart: async(req, res) => {
        try {

            const user = await Users.findById(req.user.id);
            if (!user) return res.status(400).json({ msg: "User does not exist!" });

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })

            return res.json({ msg: "Added to cart!!" });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    history: async(req, res) => {
        try {

            const history = await Payments.find({ user_id: req.user.id })

            res.json(history)

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateInfor: async(req, res) => {
        try {
            const { name , password , address, phone } = req.body;
            await Category.findOneAndUpdate({ _id: req.params.id }, { name , password , address, phone });
            res.json({ msg: "Update Success!" });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
};

const createToken = (user) => {
    return jsonwebtoken.sign(user, process.env.TOKEN, { expiresIn: '1h' }); //tạo token
}
const createRefeshToken = (user) => {
    return jsonwebtoken.sign(user, process.env.REFRESH_TOKEN, { expiresIn: '1d' }); //tạo mới token
}

module.exports = userController;