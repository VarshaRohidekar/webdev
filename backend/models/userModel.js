const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required: true,
        },
        email:{
            type:String,
            required: true,
            unique: true,
        },
        password:{
            type:String,
            required:true,
        },
        isAdmin:{
            type: Boolean,
            required:true,
            default:false,

        },
        pic:{
            type:String,
            required:true,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },



    },
    {
        timestamps:true,
    }
);
//Encrypting password & using middleware

//If the email changes, then we can say that a new user exists and it is created in the databse likewise.
//Multiple users can have the same name
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10); //Higher the value, more secure
    this.password=await bcrypt.hash(this.password,salt);
});
//decrpyt the password
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

const User = mongoose.model("User",userSchema);
module.exports = User;