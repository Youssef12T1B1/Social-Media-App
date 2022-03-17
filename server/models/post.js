const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content:String,
    username: String,
    comments: [
        {
            body: String,
            username: String
        },{timestamps:true}
    ],
    likes: [
        {
            username: String

        },{timestamps:true}
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }


},{timestamps:true})

const Post =  mongoose.model('post',postSchema)

module.exports = Post