const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true, 
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'active'
    },
    picture:{
        type:String,
    },
    skills: [
        {
            name: { type: String, required: true },
            description: { type: String }
        }
    ],
    role:{
        type:String,
        enum:["Trainer", "Learner"],
        default:"Learner"
    },
    phone:{ type: String },
    dob:{ type: String },
    fatherName:{ type: String },
    address:{ type: String },
    pinCode:{ type: String },
    highSchool:{ type: String },
    board:{ type: String },
}, {
    timestamps:true
})

module.exports = mongoose.model("User", userSchema);