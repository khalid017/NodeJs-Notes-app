const mongoose = require("mongoose")
// var uniqueValidator = require('mongoose-unique-validator'); // for unique validator

const usersSchema = new mongoose.Schema({
    name:String,
    password:String,
    email: String,
})
// usersSchema.plugin(uniqueValidator);

const uModel = mongoose.model("uModel",usersSchema)

// async function create()
// {
//  admin =  {name:"khalid",password:"123",email:"mohd.khalid@ssipmt.com",isVerified:true,admin:true}

//  await usersModel.create(admin)


// }

module.exports = uModel 
// create()