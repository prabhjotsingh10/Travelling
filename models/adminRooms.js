const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
    {
        Title:
        {
            type:String,
            // required:true
        },

        Price:
        {
            type:Number,
            // required:true
        },
        Description:
        {
            type:String,
            // required:true
        },
        Location:
        {
            type:String,
            // required:true
        }
        ,
        FeaturedRoom:
        {
            type:String,
            // required:true
        },
        roomPic:
        {
            type:String
        }
    }
)

const adminModel = mongoose.model("Admin Room", roomSchema);

module.exports = adminModel;