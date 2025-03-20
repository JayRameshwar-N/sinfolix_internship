const nodemailer = require("nodemailer");




// ----
exports.sendEmail = async (email, name) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com",
            pass: "your-email-password"  
        }
    });

    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "🎉 Happy Birthday Dear!",
        text: `Dear ${name},\n\nWishing you a very Happy Birthday! 🎂🎉\n\nBest Regards,\Sinfolix Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(` Birthday email sent to ${name} (${email})`);
    } catch (error) {
        console.error(" Email sending failed:", error);
    }
};
