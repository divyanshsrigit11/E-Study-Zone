const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); 

// rate limiter for forgot password route
const rateLimit = require('express-rate-limit');

// defining the specific limiter for authentication/emails
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: { msg: "Too many requests from this IP, please try again after 15 minutes." }
});

// ==========================================
// FORGOT PASSWORD (Send Email)
// ==========================================
router.post('/forgot-password', authLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ msg: "No account found with this email address." });
        }

        // Create a secure, temporary token valid for 15 minutes.
        // We append the user's current password hash to the secret. 
        // This ensures the token instantly expires once the password is changed.
        const secret = process.env.JWT_SECRET + user.password;
        const resetToken = jwt.sign({ id: user._id }, secret, { expiresIn: '15m' });
        
        // The link pointing to your React frontend's reset page
        const resetUrl = `http://localhost:5173/reset-password/${user._id}/${resetToken}`;

        // Construct the email HTML
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #eaeaea; border-radius: 8px; max-width: 550px; margin: 0 auto; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #dc3545; margin: 0;">E-Study Zone</h2>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h3 style="color: #333; margin-top: 0;">Password Reset Request</h3>
                    <p style="color: #555; font-size: 15px; line-height: 1.5;">Hello <strong>${user.name}</strong>,</p>
                    <p style="color: #555; font-size: 15px; line-height: 1.5;">We received a request to reset your password. Click the button below to securely set up a new password.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">Reset My Password</a>
                    </div>
                    <p style="color: #777; font-size: 13px; line-height: 1.4;"><em>Note: This link is only valid for 15 minutes. If you did not request this reset, please ignore this email and your password will remain unchanged.</em></p>
                </div>
            </div>
        `;

        // Send the email using your utility function
        await sendEmail({
            email: user.email,
            subject: 'Password Reset - E-Study Zone',
            message: emailHtml
        });

        res.json({ msg: "A password reset link has been sent to your email." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ msg: "Failed to process request. Please try again later." });
    }
});

// ==========================================
// RESET PASSWORD (Save New Password)
// ==========================================
router.post('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    try {
        // Find the user to get their current password for the secret
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Re-create the exact secret used to verify the email token
        const secret = process.env.JWT_SECRET + user.password;

        // Verify the token (Throws error if expired or altered)
        try {
            jwt.verify(token, secret);
        } catch (err) {
            return res.status(400).json({ msg: "Reset link is invalid or has expired. Please request a new one." });
        }

        // THE BULLETPROOF FIX: Force MongoDB to update the field directly!
        await User.findByIdAndUpdate(id, { password: newPassword });

        res.json({ status: "success", msg: "Password successfully updated! You can now log in." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ msg: "Server error during password reset." });
    }
});

module.exports = router;