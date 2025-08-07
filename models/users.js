const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    nombre : {
        type : String,
        required:true,
        maxLength:100
    },
    correo : {
        type: String,
        required : true,
        maxLength: 100
    },
    contraseña:{
        type: String,
        required : true,
        maxLength: 100        
    },

})

module.exports = mongoose.model("User",userSchema)                           