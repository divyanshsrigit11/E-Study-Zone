const mongoose = require('mongoose')
const AddContentSchema = mongoose.Schema({
    skillId:{
            type:mongoose.Schema.ObjectId,
            ref:'Skill'
        },
    file:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    comment:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User'
            },
            text:{
                type:String,
                required:true
            }
        }
    ],
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }, 
    status:{
        type:String,
        enum:['draft', 'publish']
    } 
}, {
    timestamps:true
}
)

module.exports = mongoose.model("AddContent", AddContentSchema);