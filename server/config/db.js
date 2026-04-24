const mongoose = require('mongoose');

const MongoDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then((conn) => {
        console.log(`DB connected Successfully to: ${conn.connection.name}`);
    })
    .catch((err) => {
        console.log("DB is not connected. Error:", err.message);
    });
}

module.exports = MongoDB;