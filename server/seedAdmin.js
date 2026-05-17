const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@estudyzone.com";
    const hashedPassword = await bcrypt.hash("superAdmin@123", 10);

    await Admin.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { upsert: true, new: true }
    );
    console.log("Admin upserted with encrypted password!");
    process.exit();
};

seedAdmin();