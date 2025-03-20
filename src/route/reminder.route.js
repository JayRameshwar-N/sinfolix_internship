const express= require('express');
const router= express.Router();


const { isAuthenticatedUser }= require("../middlewars/auth")
const { sendBirthdayReminders }= require("../controller/reminder.controller");



// routes
router.get("/send-birthday-reminders", sendBirthdayReminders);





module.exports= router;