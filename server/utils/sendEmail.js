const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // 1. Generate a temporary fake account on the fly
        let testAccount = await nodemailer.createTestAccount();

        // 2. Create the transporter using Ethereal's SMTP server
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // 3. Define the email content
        const mailOptions = {
            from: '"E-Study Zone Support" <support@estudyzone.com>',
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        // 4. Send the email
        let info = await transporter.sendMail(mailOptions);

        // 5. THE CRITICAL PART: Log the preview URL to your terminal
        console.log("\n==========================================");
        console.log("✉️  EMAIL INTERCEPTED BY ETHEREAL");
        console.log("🔗 Click here to view the email: %s", nodemailer.getTestMessageUrl(info));
        console.log("==========================================\n");

    } catch (error) {
        console.error("Error sending email via Ethereal:", error);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;