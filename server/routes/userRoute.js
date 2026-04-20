const express = require('express')
const User = require('../models/User')
const routes = express.Router();
const jwt = require('jsonwebtoken')
const Skill = require('../models/Skill');
const AddContent = require('../models/Content');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Handshake = require('../models/Handshake');

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

//for user registration
routes.post('/register', async(req, res) => {
    try{
        const {name, email, password, qualification, role} = req.body;
        const user = await User.findOne({email:email});
        if(user) {
            return res.json({msg: "User already Registered"})
        }

        const data = await new User({
            name:name,
            email:email,
            password:password,
            qualification:qualification,
            role:role,
        })

        await data.save();
        res.json({msg: "User Registered Successfully"})
    }
    catch(er) {
        console.log(er);
        res.json({msg: "User Not Registered"}) 
    }
})

//get user by user id
routes.get('/getuser/:id', async(req, res) => {
    try {
        const data = await User.findById(req.params.id)
        res.json({msg: "Data fetched", data:data})
    } 
    catch(er) {
        console.log(er);;
        res.json({msg: "User not fetched"})
        
    }
})

// get all user
routes.get('/getuser', async(req, res) => {
    try {
        const data = await User.find(req.params.id)
        return res.json({msg: "Data fetched", data:data})
    } catch(er) {
        console.log(er);;
        return res.json({msg: "User not fetched"})
        
    }
})

//get all inactive user
routes.get('/getuser/all/inactive', async(req, res) => {
    try {
        const data = await User.find({status:"inactive"})
        res.json({msg: "Data fetched", data:data})
    } 
    catch(er) {
        console.log(er);;
        return res.json({msg: "Inactive User not fetched"})
    }
})

//routes to block the user
routes.get('/block/:id', async(req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, {status: 'inactive'});
        res.json({msg: "Data fetched", data:data})
    } catch(er) {
        console.log(er);;
        res.json({msg: "Try agian Later"})   
    }
})

// routes to un-block the user
routes.get('/unblock/:id', async(req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, {status: 'active'});
        res.json({msg: "Data fetched", data:data})
    } catch(er) {
        console.log(er);;
        res.json({msg: "Try agian Later"})   
    }
})

// login
routes.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body
        const data = await User.findOne({ email:email })
        if(!data) {
            return res.json({msg: "Email is incorrect"});
        }
        if(data.password==password) {
            const token = jwt.sign({id:data._id}, process.env.JWT_SECRET, {expiresIn:"1d"})
            res.json({msg: "Login Successfully", data:{
                token,
                id:data._id,
                role:data.role,
                email:data.email,
                name:data.name
            }});
        }
        else {
            return res.json({msg: "Password is incorrect"});
        }
    }
    catch(er) {
        console.log(er);
        res.json({msg: "Try again Later"});
        
    }
})

// to perform crud on skills page.
// fetch skills for a user
routes.get('/skills/:userId', async (req, res) => {
    try {
        const skillDoc = await Skill.findOne({ userId: req.params.userId });
        res.json(skillDoc ? skillDoc.skills : []);
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch skills" });
    }
});

// add a new skill
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

// remove a skill
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

// edit a skill
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

// to toggle a skill's status
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

// change password route/logic
routes.post('/change-password/:id', async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // ladder if-else condition
        if (user.password !== oldPassword) {
            return res.status(400).json({ msg: "Old password is incorrect" });
        } else if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: "New password and Confirm password do not match" });
        } else if (oldPassword === newPassword) {
            return res.status(400).json({ msg: "New password cannot be the same as old password" });
        } else {
            // all validations passed, save the new password
            user.password = newPassword;
            await user.save();
            return res.status(200).json({ msg: "Password changed successfully" });
        }
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to change password" });
    }
});

// update user profile
routes.put('/update-profile/:id', async (req, res) => {
    try {
        const { name, phone, dob, fatherName, address, pinCode, highSchool, board } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { 
                $set: { name, phone, dob, fatherName, address, pinCode, highSchool, board }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ msg: "Profile updated successfully", data: updatedUser });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to update profile" });
    }
});

// get all trainer only
routes.get('/getuser/trainer/get', async (req, res) => {
    try {
        const data = await User.find({ role: "Trainer" });
        res.json({ msg: "Trainers fetched successfully", data: data });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Trainers not fetched" });
    }
});


// add content (Draft or Publish)
// routes.post('/content/add/:userId', async (req, res) => {
//     try {
//         const { skillId, file, status } = req.body;

//         const newContent = new AddContent({
//             skillId: skillId,
//             file: file,
//             userId: req.params.userId,
//             status: status
//         });

//         await newContent.save();
//         res.json({ msg: `Content successfully saved as ${status}!` });
//     } catch (er) {
//         console.error(er);
//         res.status(500).json({ msg: "Failed to save content" });
//     }
// });

// search published content by keyword (Trainer name or Skill name)
routes.get('/content/search', async (req, res) => {
    try {
        const keyword = req.query.q?.toLowerCase() || '';

        const contents = await AddContent.find({ status: 'publish' })
            .populate('userId', 'name email');

        const allSkillDocs = await Skill.find();
        
        const skillMap = {};
        allSkillDocs.forEach(doc => {
            if (doc.skills && doc.skills.length > 0) {
                doc.skills.forEach(skill => {
                    skillMap[skill._id.toString()] = skill.name;
                });
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

routes.post('/content/add/:userId', upload.single('file'), async (req, res) => {
    try {
        const { skillId, status } = req.body;

        if (!req.file) {
            return res.status(400).json({ msg: "Please upload a file!" });
        }

        const newContent = new AddContent({
            skillId: skillId,
            file: req.file.filename, 
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

// for handshake requests
// search trainers by skill name or trainer name (for learner)
routes.get('/trainers/search', async (req, res) => {
    try {
        const keyword = req.query.q?.toLowerCase() || '';
        if (!keyword) return res.json({ data: [] });

        // Fetch all skills and populate the Trainer's details
        const allSkillDocs = await Skill.find().populate('userId', 'name _id role');

        let matchedTrainers = [];

        // Loop through docs and array to find matches
        allSkillDocs.forEach(doc => {
            if (doc.userId && doc.userId.role === 'Trainer') {
                
                // Grab the trainer's name and convert to lowercase for comparison
                const trainerName = doc.userId.name.toLowerCase();

                doc.skills.forEach(skill => {
                    const skillName = skill.name.toLowerCase();
                    
                    // Match if the keyword is in the SKILL NAME - OR - the TRAINER NAME
                    if (skill.status === 'active' && (skillName.includes(keyword) || trainerName.includes(keyword))) {
                        matchedTrainers.push({
                            skillId: skill._id,
                            skillName: skill.name,
                            status: skill.status, 
                            trainerName: doc.userId.name,
                            trainerId: doc.userId._id
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

// create handshake request
// 1. CREATE HANDSHAKE REQUEST (Now includes Skill Data)
routes.post('/handshake/send', async (req, res) => {
    try {
        const { learnerId, trainerId, skillId, skillName } = req.body;
        // console.log("INCOMING HANDSHAKE DATA:", req.body);

        // Check if request exists for THIS specific trainer AND THIS specific skill
        const existingReq = await Handshake.findOne({ learnerId, trainerId, skillId });
        if (existingReq) {
            return res.status(400).json({ msg: `You already sent a request for ${skillName} to this trainer!` });
        }

        const newHandshake = new Handshake({
            learnerId,
            trainerId,
            skillId,
            skillName, // Save the name so we don't have to run complex population queries later!
            status: 'pending'
        });

        await newHandshake.save();
        res.json({ msg: "Handshake request sent successfully!" });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to send request" });
    }
});

// get history of handshake request for trainer
routes.get('/handshake/learner/:id', async (req, res) => {
    try {
        const history = await Handshake.find({ learnerId: req.params.id })
            .populate('trainerId', 'name email phone'); // Get trainer details
        res.json({ data: history });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch handshake history" });
    }
});

// for trainers to see incoming handshake requests
// GET TRAINER'S HANDSHAKE REQUESTS & CONNECTIONS
routes.get('/handshake/trainer/:id', async (req, res) => {
    try {
        const requests = await Handshake.find({ trainerId: req.params.id })
            .populate('learnerId', 'name email qualification'); 
            
        res.json({ data: requests });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to fetch trainer handshakes" });
    }
});

// UPDATE HANDSHAKE STATUS (Accept / Reject)
routes.put('/handshake/update/:id', async (req, res) => {
    try {
        const { status } = req.body; // Expects 'accepted' or 'rejected'
        
        await Handshake.findByIdAndUpdate(req.params.id, { status: status });
        
        res.json({ msg: `Connection request ${status}!` });
    } catch (er) {
        console.error(er);
        res.status(500).json({ msg: "Failed to update handshake status" });
    }
});

// my content for user
routes.get('/learner/content/:learnerId', async (req, res) => {
    try {
        const handshakes = await Handshake.find({
            learnerId: req.params.learnerId,
            status: 'accepted'
        }).populate('trainerId', 'name');

        if (!handshakes || handshakes.length === 0) {
            return res.json({ data: [] });
        }

        let accessibleContent = [];

        for (let hs of handshakes) {
            const contents = await AddContent.find({
                userId: hs.trainerId._id,
                skillId: hs.skillId,
                status: 'publish'
            });

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

// Get all uploaded content for a specific trainer
routes.get('/content/trainer/:userId', async (req, res) => {
    try {
        const contents = await AddContent.find({ userId: req.params.userId });

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
        res.status(500).json({ msg: "Failed to fetch trainer contents" });
    }
});

// Update content status (Draft <-> Publish)
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

// Delete content
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