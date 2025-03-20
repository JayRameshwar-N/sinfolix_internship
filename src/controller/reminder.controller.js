const cron = require("node-cron");
const User = require("../model/user.model"); 
const {sendEmail} = require("../utils/email.con");




// ----- Birthday Reminder 
exports.sendBirthdayReminders = async (req, res) => {

    try {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; 

        const users = await User.find({
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: "$birthday" }, day] },
                    { $eq: [{ $month: "$birthday" }, month] }
                ] 
            }
        });

        if (users.length === 0) {
            return res.status(200).json({ message: "No birthdays today." });
        }

        for (let user of users) {
            await sendEmail(user.email, user.firstName);
        }

        res.status(200).json({ message: `Birthday reminders sent to ${users.length} team members.` });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Schedule Birthday Reminder to Run Automatically at Midnight
cron.schedule("0 0 * * *", async () => {
    await exports.sendBirthdayReminders();
});


