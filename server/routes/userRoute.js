const express = require('express')
const User = require('../models/User')
const routes = express.Router();
const jwt = require('jsonwebtoken')
const Skill = require('../models/Skill');

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
routes.get('/block/:id', async(req, res) => {
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


module.exports = routes;