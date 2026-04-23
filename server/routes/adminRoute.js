const express = require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const AddContent = require('../models/Content'); 
const routes = express.Router();
const jwt = require('jsonwebtoken');
const Skill = require('../models/Skill');
const Setting = require('../models/Setting');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs'); 
const rateLimit = require('express-rate-limit');

// Strict limit for Admin login to prevent brute-force attacks
const adminAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { msg: "Too many admin login attempts. Please try again after 15 minutes." }
});

// --- AUTH ROUTES ---
routes.post('/register', async(req,res) => {
    try {
        const { email, password } = req.body;
        const data = await Admin.findOne({email:email});
        if(data) return res.json({msg: "Duplicate email"});
        
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            ...req.body,
            password: hashedPassword
        });

        await newAdmin.save();
        res.json({msg:"Admin registered Successfully"});
    } catch(er) {
        console.error(er);
        res.status(500).json({msg: "Internal Server Error"});
    }
}); 

routes.post('/login', adminAuthLimiter, async(req, res) => {
    try {
        const { email, password } = req.body;
        const isExist = await Admin.findOne({email:email});
        if(!isExist) return res.json({msg: "Data Not Matched"});
        
        let isMatch = false;

        // Hybrid check for hashed vs plain-text passwords
        if (isExist.password.startsWith('$2')) {
            isMatch = await bcrypt.compare(password, isExist.password);
        } else {
            isMatch = (password === isExist.password);
        }

        if(isMatch) {
            const token = jwt.sign({id:isExist._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
            res.json({msg: "Login Successfully", data:{
                token:token,
                email:isExist.email,
                id:isExist._id,
                role:"admin"
            }});
        } else {
            res.json({msg: "Password Not Matched"});
        }
    } catch(er) {
        console.error(er);
        res.status(500).json({msg: "Sorry try again"});
    }
});

// --- DASHBOARD STATS ---
routes.get('/dashboard-stats', async (req, res) => {
    try {
        const totalLearners = await User.countDocuments({ role: 'Learner' });
        const activeTrainers = await User.countDocuments({ role: 'Trainer', status: 'active' });
        const pendingApprovals = await User.countDocuments({ role: 'Trainer', status: 'inactive' });
        const publishedFiles = await AddContent.countDocuments({ status: 'publish' });

        const latestTrainers = await User.find({ role: 'Trainer' }).sort({ createdAt: -1 }).limit(3);
        const latestLearners = await User.find({ role: 'Learner' }).sort({ createdAt: -1 }).limit(3);
        const latestContent = await AddContent.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(4);

        res.json({
            data: { 
                totalLearners, 
                activeTrainers, 
                pendingApprovals, 
                publishedFiles,
                latestTrainers,
                latestLearners,
                latestContent
            }
        });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch dashboard stats" });
    }
});

// --- USER MANAGEMENT ---
routes.get('/trainers', async (req, res) => {
    try {
        const data = await User.find({ role: "Trainer" });
        res.json({ msg: "Trainers fetched successfully", data: data });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Trainers not fetched" });
    }
});

routes.get('/learners', async (req, res) => {
    try {
        const data = await User.find({ role: "Learner" });
        res.json({ msg: "Learners fetched successfully", data: data });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Learners not fetched" });
    }
});

routes.get('/block/:id', async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, {status: 'inactive'});
        res.json({msg: "User successfully suspended", data:data})
    } catch(er) {
        console.error(er);
        res.status(500).json({msg: "Failed to suspend user"})   
    }
});

routes.get('/unblock/:id', async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, {status: 'active'});
        res.json({msg: "User successfully approved/activated", data:data})
    } catch(er) {
        console.error(er);
        res.status(500).json({msg: "Failed to activate user"})   
    }
});

// --- CONTENT MODERATION ---
routes.get('/content/all', async (req, res) => {
    try {
        const contents = await AddContent.find().populate('userId', 'name email role');
        const allSkillDocs = await Skill.find();
        const skillMap = {};
        allSkillDocs.forEach(doc => {
            if (doc.skills) {
                doc.skills.forEach(skill => {
                    skillMap[skill._id.toString()] = skill.name;
                });
            }
        });

        const formattedContents = contents.map(content => ({
            ...content.toObject(),
            skillName: skillMap[content.skillId?.toString()] || 'Unknown Skill'
        }));

        res.json({ data: formattedContents });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch all contents" });
    }
});

routes.put('/content/hide/:id', async (req, res) => {
    try {
        await AddContent.findByIdAndUpdate(req.params.id, { status: 'blocked' });
        res.json({ msg: "Content safely blocked and hidden from learners!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to block content" });
    }
});

routes.put('/content/unhide/:id', async (req, res) => {
    try {
        await AddContent.findByIdAndUpdate(req.params.id, { status: 'publish' });
        res.json({ msg: "Content restored and is now live again!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to restore content" });
    }
});

// --- SYSTEM SETTINGS & NOTIFICATIONS ---
routes.get('/settings', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) settings = await Setting.create({});
        res.json({ data: settings });
    } catch (er) {
        res.status(500).json({ msg: "Failed to fetch settings" });
    }
});

routes.put('/settings', async (req, res) => {
    try {
        const { maintenanceMode, platformName } = req.body;
        let settings = await Setting.findOne();
        settings.maintenanceMode = maintenanceMode;
        settings.platformName = platformName;
        await settings.save();
        res.json({ msg: "System settings updated successfully!" });
    } catch (er) {
        res.status(500).json({ msg: "Failed to update settings" });
    }
});

routes.post('/broadcast', async (req, res) => {
    try {
        await Notification.create({ message: req.body.message });
        res.json({ msg: "Broadcast sent to all users!" });
    } catch (er) {
        res.status(500).json({ msg: "Failed to send broadcast" });
    }
});

routes.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ date: -1 });
        res.json({ data: notifications });
    } catch (er) {
        res.status(500).json({ msg: "Failed to fetch notifications" });
    }
});

module.exports = routes;