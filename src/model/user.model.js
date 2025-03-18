const mongoose = require("mongoose");


const profileUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"], 
        default: "user",  
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    token: {
        type: String,
        required: true
    }
    });

module.exports = mongoose.model('userProfile', profileUsSchema);
