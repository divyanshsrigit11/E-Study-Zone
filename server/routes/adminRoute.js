const express = require('express')
const Admin = require('../models/Admin')
const routes = express.Router();
const jwt = require('jsonwebtoken')


routes.post('/register', async(req,res) => {
    try{
        const { email, password } = req.body
        const data = await Admin.findOne({email:email})
        if(data) {
            return res.json({msg: "Duplicate email"});
        }
        const user = await new Admin(req.body);
        await user.save();
        res.json({msg:"Admin registered Successfully"});
    }
    catch(er) {
        console.log(er);;
        res.json({msg: "Sorry try again"})
    }
})


// for login
routes.post('/login', async(req, res) => {
    try{
        const { email, password } = req.body;
        const isExist = await Admin.findOne({email:email})
        if(!isExist) {
            return res.json({msg: "Data Not Matched"});
        }
        if(isExist.password == password) {
            const token = jwt.sign({id:isExist._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
            res.json({msg: "Login Successfully", data:{
                token:token,
                email:isExist.email,
                id:isExist._id,
                role:"admin"
            }})
        } else {
            res.json({msg: "Password Not Matched"})
        }
    } 
    catch(er) {
        console.log("Sorry try again");
        res.json({msg: "Soory try again"})
    }
})

module.exports = routes