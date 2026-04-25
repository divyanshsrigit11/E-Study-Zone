const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Path to your User model
require('dotenv').config();

const seedAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash("superAdmin@123", 10);
    
    const admin = new User({
        name: "Super Admin",
        email: "admin@estudyzone.com",
        password: hashedPassword,
        role: "Admin",
        status: "active"
    });

    await admin.save();
    console.log("Admin created successfully!");
    process.exit();
};

seedAdmin();