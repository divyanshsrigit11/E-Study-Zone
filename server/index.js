const express = require('express')
const cors =require('cors')
const dotenv = require('dotenv')
const MongoDB = require('./config/db')
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
MongoDB();

// API Started
app.use('/api/user', require('./routes/userRoute'))
app.use('/api/admin', require('./routes/adminRoute'))
// for multer
app.use('/uploads', express.static('uploads'));
// API Ended

app.listen(process.env.PORT, () => {
    console.log("Server started at Port", process.env.PORT);
    
})