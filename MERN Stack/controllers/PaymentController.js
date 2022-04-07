const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel');

const paymentController = {
    getPayments: async(req, res) => {
        try {
            const payments = await Payments.find()
            res.json(payments);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createPayment: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email address phone');
            if (!user) return res.status(400).json({ msg: "User does not extit!!" })

            const { cart } = req.body;
            const { _id, name, email, address, phone } = user;

            const newPayment = new Payments({
                user_id: _id,
                name: name,
                email,
                cart,
                address: address,
                phone,
                status: true

            })
            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })
            await newPayment.save();

            res.json(newPayment);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}
const sold = async(id, quantity, oldSold) => {
    await Products.findOneAndUpdate({ _id: id }, {
        sold: quantity + oldSold
    })
}
module.exports = paymentController