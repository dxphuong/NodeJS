require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
const morgan = require("morgan");


const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload({
    useTempFiles: true,
}));

//route
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/UploadPicture'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));

//kết nối tới database
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log("Connect to Mongoose");
});

app.get("/", (req, res) => {
    res.send("Successfull!!!");
});
//chạy server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
});