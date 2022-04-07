const router = require('express').Router();
const cloudinary = require('cloudinary');
const authAdmin = require('../middleware/authAdmin');
const authUser = require('../middleware/authUser');
const fs = require('fs');
const { async } = require('rxjs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
});
//upload 1 file ảnh
router.post('/upload', authUser, authAdmin, (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No file uploaded!' })

        const file = req.files.file;
        if (file.size > 1024 * 1024 * 5) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Size too large!" })
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "File format is not correct!" })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "ProductImage" }, async(err, result) => {
            if (err) throw err;

            removeTmp(file.tempFilePath)

            res.json({ public_id: result.public_id, url: result.secure_url });
        })


    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
//Xóa file
router.post('/destroy', authUser, authAdmin, (req, res) => {
        try {
            const { public_id } = req.body;
            if (!public_id) return res.status(400).json({ msg: 'Can not find image!' })

            cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
                if (err) throw err;
                res.json({ msg: "Delete success!" });
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    })
    //Xóa file tạm khi gửi file
const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}
module.exports = router;