const mongoose=require("mongoose");

//schema
const userSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
     type:String,
     required:true   
    },
    confirmpassword:{
        type:String,
        required:true
    }
})
//now collection
const Register=new mongoose.model("Register",userSchema);
module.exports=Register;