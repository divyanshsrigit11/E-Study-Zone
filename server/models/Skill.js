const mongoose = require('mongoose')
const skillSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    skills: [   
        {
            name: { type: String, required: true },
            description: { type: String },
            status: {
                type: String,
                enum: ['active', 'inactive'],
                default: 'active'
            }
        }
    ], 
}, {
    timestamps:true
}
)

module.exports = mongoose.model("Skill", skillSchema);