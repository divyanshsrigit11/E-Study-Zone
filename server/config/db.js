const mongoose = require('mongoose')
const MongoDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB connected Successfully");
    })
    .catch(() => {
        console.log("DB is not connected");;
        
    })
}

module.exports = MongoDB;