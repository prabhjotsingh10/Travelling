const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({

    FirstName:
    {
        type:String,
        required:true

    },

    LastName:
    {
        type:String,
        required:true
    },

    Password:
    {
        type:String,
        required:true
    },

    Email:
    {
        type:String,
        required:true,
    },

    PhoneNo:
    {
        type:Number,
        required:true
    },

    DateOfBirth:
    {
        type:Date,
        required:true

    },
    
    type:
    {
        type:String,
        default:"User"
    }

})

userSchema.pre("save",function(next){

    bcrypt.genSalt(10)
    .then((salt)=>{
        bcrypt.hash(this.Password,salt)
        
        .then((encryptedPassword)=>{
            this.Password=encryptedPassword;
            next();
        })
    })
    .catch(error=>console.log(`Error occured while salting the password ${error}`));
})

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;



