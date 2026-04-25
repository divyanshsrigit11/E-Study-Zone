const express = require('express');
const User = require('../models/User');
const routes = express.Router();
const jwt = require('jsonwebtoken');
const Skill = require('../models/Skill');
const AddContent = require('../models/Content');
const multer = require('multer');
const { uploadProfile, uploadContent } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const Handshake = require('../models/Handshake');
const Notification = require('../models/Notification');
const Setting = require('../models/Setting');
// rate limiter for auth routes
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { msg: "Too many attempts from this IP, please try again after 15 minutes." }
});


// configuring multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads/';
        cb(null, './uploads/'); 
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true }); 
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// ==========================================
// THE MAINTENANCE INTERCEPTOR & GLOBAL ROUTES
routes.use(async (req, res, next) => {
    const exemptRoutes = ['/login', '/register', '/settings', '/notifications'];
    const isExempt = exemptRoutes.some(route => req.path.includes(route));

    if (!isExempt) {
        try {
            const settings = await Setting.findOne();
            if (settings && settings.maintenanceMode) {
                return res.status(503).json({ msg: "Action Halted: Site is currently under maintenance." });
            }
        } catch (error) {
            console.error("Error checking maintenance mode:", error);
        }
    }
    next();
});

routes.get('/settings', async (req, res) => {
    try {
        const settings = await Setting.findOne() || { maintenanceMode: false };
        res.json({ data: settings });
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch settings" });
    }
});

routes.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ date: -1 });
        res.json({ data: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to fetch notifications" });
    }
});

// ==========================================
// STANDARD USER ROUTES (WITH APPROVAL LOGIC)
// ==========================================

routes.post('/register', authLimiter, async(req, res) => {
    try {
        const {name, email, password, qualification, role} = req.body;
        
        const user = await User.findOne({email: email});
        if(user) {
            return res.json({msg: "User already Registered"});
        }

        const salt = await bcrypt.genSalt(10);
        
        const hashedPassword = await bcrypt.hash(password, salt);

        const initialStatus = role === 'Trainer' ? 'inactive' : 'active';

        const data = new User({
            name, 
            email, 
            password: hashedPassword,
            qualification, 
            role, 
            status: initialStatus
        });

        await data.save();
        res.json({msg: "User Registered Successfully"});
    }
    catch(er) {
        console.log(er);
        res.json({msg: "User Not Registered"});
    }
});

routes.get('/getuser/:id', async(req, res) => {
    try {
        const data = await User.findById(req.params.id)
        res.json({msg: "Data fetched", data:data})
    } 
    catch(er) {
        console.log(er);;
        res.json({msg: "User not fetched"})
    }
});

routes.get('/getuser', async(req, res) => {
    try {
        const data = await User.find(req.params.id)
        return res.json({msg: "Data fetched", data:data})
    } catch(er) {
        console.log(er);;
        return res.json({msg: "User not fetched"})
    }
});

routes.get('/getuser/all/inactive', async(req, res) => {
    try {
        const data = await User.find({status:"inactive"})
        res.json({msg: "Data fetched", data:data})
    } 
    catch(er) {
        console.log(er);;
        return res.json({msg: "Inactive User not fetched"})
    }
});

routes.get('/block/:id', async(req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, {status: 'inactive'});
        res.json({msg: "Data fetched", data:data})
    } catch(er) {
        console.log(er);;
        res.json({msg: "Try agian Later"})   
    }
});

routes.get('/unblock/:id', async(req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, {status: 'active'});
        res.json({msg: "Data fetched", data:data})
    } catch(er) {
        console.log(er);;
        res.json({msg: "Try agian Later"})   
    }
});

routes.post('/login', authLimiter, async(req, res) => {
    try {
        const { email, password } = req.body;
        const data = await User.findOne({ email: email });
        
        if(!data) {
            return res.json({msg: "Email is incorrect"});
        }
        
        // --- THE HYBRID PASSWORD CHECK ---
        let isMatch = false;
        
        // bcrypt hashes always start with "$2a$", "$2b$", or "$2y$"
        if (data.password.startsWith('$2')) {
            // Compare the plain text input against the hashed DB password
            isMatch = await bcrypt.compare(password, data.password);
        } else {
            // Fallback for your old test accounts with plain-text passwords
            isMatch = (password === data.password);
        }
        
        if(isMatch) {
            if (data.role === 'Trainer' && data.status === 'inactive') {
                return res.json({msg: "Your account is pending admin approval."});
            }

            const token = jwt.sign({id:data._id}, process.env.JWT_SECRET, {expiresIn:"1d"});
            res.json({msg: "Login Successfully", data:{
                token,
                id: data._id,
                role: data.role,
                email: data.email,
                name: data.name
            }});
        } else {
            return res.json({msg: "Password is incorrect"});
        }
    }
    catch(er) {
        console.log("Login Error:", er);
        res.json({msg: "Try again Later"});
    }
});

// --- SKILL MANAGEMENT ---
routes.get('/skills/:userId', async (req, res) => {
    try {
        const skillDoc = await Skill.findOne({ userId: req.params.userId });
        res.json(skillDoc ? skillDoc.skills : []);
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch skills" });
    }
});

routes.post('/skills/:userId', async (req, res) => {
    try {
        const { name, description } = req.body;
        let skillDoc = await Skill.findOne({ userId: req.params.userId });

        if (!skillDoc) {
            skillDoc = new Skill({
                userId: req.params.userId,
                skills: [{ name, description }]
            });
        } else {
            skillDoc.skills.push({ name, description });
        }

        await skillDoc.save();
        res.json({ msg: "Skill added successfully!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to add skill" });
    }
});

routes.delete('/skills/:userId/:skillId', async (req, res) => {
    try {
        const skillDoc = await Skill.findOne({ userId: req.params.userId });
        if (skillDoc) {
            skillDoc.skills = skillDoc.skills.filter(s => s._id.toString() !== req.params.skillId);
            await skillDoc.save();
        }
        res.json({ msg: "Skill deleted successfully!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to delete skill" });
    }
});

routes.put('/skills/:userId/:skillId', async (req, res) => {
    try {
        const { name, description } = req.body;
        const skillDoc = await Skill.findOne({ userId: req.params.userId });
        
        if (skillDoc) {
            const skillToEdit = skillDoc.skills.id(req.params.skillId);
            if (skillToEdit) {
                skillToEdit.name = name || skillToEdit.name;
                skillToEdit.description = description || skillToEdit.description;
                await skillDoc.save();
            }
        }
        res.json({ msg: "Skill updated successfully!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to update skill" });
    }
});

routes.patch('/skills/:userId/:skillId/toggle', async (req, res) => {
    try {
        const skillDoc = await Skill.findOne({ userId: req.params.userId });
        if (skillDoc) {
            const skillToToggle = skillDoc.skills.id(req.params.skillId);
            if (skillToToggle) {
                skillToToggle.status = skillToToggle.status === 'active' ? 'inactive' : 'active';
                await skillDoc.save();
            }
        }
        res.json({ msg: "Skill status toggled successfully!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to toggle skill status" });
    }
});

routes.post('/change-password/:id', async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: "User not found" });

        if (user.password !== oldPassword) {
            return res.status(400).json({ msg: "Old password is incorrect" });
        } else if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: "New password and Confirm password do not match" });
        } else if (oldPassword === newPassword) {
            return res.status(400).json({ msg: "New password cannot be the same as old password" });
        } else {
            user.password = newPassword;
            await user.save();
            return res.status(200).json({ msg: "Password changed successfully" });
        }
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to change password" });
    }
});

// Profile update WITH picture upload support
routes.put('/update-profile/:id', uploadProfile.single('picture'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            phone: req.body.phone,
            dob: req.body.dob,
            fatherName: req.body.fatherName,
            address: req.body.address,
            pinCode: req.body.pinCode,
            highSchool: req.body.highSchool,
            board: req.body.board
        };

        if (req.file) {
            updateData.picture = req.file.path; 
        }

        await User.findByIdAndUpdate(req.params.id, updateData);
        res.json({ msg: "Profile updated successfully!" });
        
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ msg: "Failed to update profile" });
    }
});

routes.get('/getuser/trainer/get', async (req, res) => {
    try {
        const data = await User.find({ role: "Trainer" });
        res.json({ msg: "Trainers fetched successfully", data: data });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Trainers not fetched" });
    }
});

// --- CONTENT & HANDSHAKE ROUTES ---
routes.get('/content/search', async (req, res) => {
    try {
        const keyword = req.query.q?.toLowerCase() || '';
        const contents = await AddContent.find({ status: 'publish' }).populate('userId', 'name email');
        const allSkillDocs = await Skill.find();
        
        const skillMap = {};
        allSkillDocs.forEach(doc => {
            if (doc.skills && doc.skills.length > 0) {
                doc.skills.forEach(skill => { skillMap[skill._id.toString()] = skill.name; });
            }
        });

        const filteredContents = contents.filter(content => {
            const trainerName = content.userId?.name?.toLowerCase() || '';
            const actualSkillName = skillMap[content.skillId?.toString()] || '';
            const skillNameLower = actualSkillName.toLowerCase();
            return trainerName.includes(keyword) || skillNameLower.includes(keyword);
        });

        const formattedContents = filteredContents.map(content => ({
            ...content.toObject(),
            skillName: skillMap[content.skillId?.toString()] || 'Unknown Skill'
        }));

        res.json({ msg: "Search successful", data: formattedContents });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to search content" });
    }
});

routes.post('/content/add/:userId', uploadContent.single('file'), async (req, res) => {
    try {
        const { skillId, status } = req.body;
        if (!req.file) return res.status(400).json({ msg: "Please upload a file!" });

        const newContent = new AddContent({
            skillId: skillId,
            // CRITICAL FIX: Use req.file.path to save the live Cloudinary URL, not filename!
            file: req.file.path, 
            userId: req.params.userId,
            status: status
        });

        await newContent.save();
        res.json({ msg: `Content successfully saved as ${status}!` });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to save content" });
    }
});

routes.get('/trainers/search', async (req, res) => {
    try {
        const keyword = req.query.q?.toLowerCase() || '';
        if (!keyword) return res.json({ data: [] });

        const allSkillDocs = await Skill.find().populate('userId', 'name _id role');
        let matchedTrainers = [];

        allSkillDocs.forEach(doc => {
            if (doc.userId && doc.userId.role === 'Trainer') {
                const trainerName = doc.userId.name.toLowerCase();
                doc.skills.forEach(skill => {
                    const skillName = skill.name.toLowerCase();
                    if (skill.status === 'active' && (skillName.includes(keyword) || trainerName.includes(keyword))) {
                        matchedTrainers.push({
                            skillId: skill._id, skillName: skill.name, status: skill.status, 
                            trainerName: doc.userId.name, trainerId: doc.userId._id
                        });
                    }
                });
            }
        });
        res.json({ msg: "Search successful", data: matchedTrainers });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to search trainers" });
    }
});

routes.post('/handshake/send', async (req, res) => {
    try {
        const { learnerId, trainerId, skillId, skillName } = req.body;
        const existingReq = await Handshake.findOne({ learnerId, trainerId, skillId });
        if (existingReq) return res.status(400).json({ msg: `You already sent a request for ${skillName} to this trainer!` });

        const newHandshake = new Handshake({ learnerId, trainerId, skillId, skillName, status: 'pending' });
        await newHandshake.save();
        res.json({ msg: "Handshake request sent successfully!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to send request" });
    }
});

routes.get('/handshake/learner/:id', async (req, res) => {
    try {
        const history = await Handshake.find({ learnerId: req.params.id }).populate('trainerId', 'name email phone'); 
        res.json({ data: history });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch handshake history" });
    }
});

routes.get('/handshake/trainer/:id', async (req, res) => {
    try {
        const requests = await Handshake.find({ trainerId: req.params.id }).populate('learnerId', 'name email qualification');     
        res.json({ data: requests });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch trainer handshakes" });
    }
});

routes.put('/handshake/update/:id', async (req, res) => {
    try {
        const { status } = req.body; 
        await Handshake.findByIdAndUpdate(req.params.id, { status: status });
        res.json({ msg: `Connection request ${status}!` });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to update handshake status" });
    }
});

routes.get('/learner/content/:learnerId', async (req, res) => {
    try {
        const handshakes = await Handshake.find({ learnerId: req.params.learnerId, status: 'accepted' }).populate('trainerId', 'name');
        if (!handshakes || handshakes.length === 0) return res.json({ data: [] });

        let accessibleContent = [];
        for (let hs of handshakes) {
            const contents = await AddContent.find({ userId: hs.trainerId._id, skillId: hs.skillId, status: 'publish' });
            contents.forEach(item => {
                accessibleContent.push({
                    ...item.toObject(),
                    trainerName: hs.trainerId.name,
                    skillName: hs.skillName
                });
            });
        }
        res.json({ msg: "Content fetched", data: accessibleContent });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch accessible content" });
    }
});

routes.get('/content/trainer/:userId', async (req, res) => {
    try {
        const contents = await AddContent.find({ userId: req.params.userId });
        const allSkillDocs = await Skill.find();
        const skillMap = {};
        allSkillDocs.forEach(doc => {
            if (doc.skills) {
                doc.skills.forEach(skill => { skillMap[skill._id.toString()] = skill.name; });
            }
        });

        const formattedContents = contents.map(content => ({
            ...content.toObject(),
            skillName: skillMap[content.skillId?.toString()] || 'Unknown Skill'
        }));
        res.json({ data: formattedContents });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch trainer contents" });
    }
});

routes.put('/content/status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await AddContent.findByIdAndUpdate(req.params.id, { status });
        res.json({ msg: `Content successfully marked as ${status}!` });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to update content status" });
    }
});

routes.delete('/content/:id', async (req, res) => {
    try {
        await AddContent.findByIdAndDelete(req.params.id);
        res.json({ msg: "Content deleted successfully!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to delete content" });
    }
});

module.exports = routes;