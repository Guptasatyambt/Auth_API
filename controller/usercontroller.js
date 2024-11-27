const { setuser } = require('../services/userServices')
const User = require('../model/usermodel');
const bycrpt = require('bcrypt');
const fs = require('fs')
const nodemailer = require('nodemailer');

let otpStore = {};


async function handleregister(req, res) {
    try {
        const { email, password,role } = req.body
        if (!email || !password||!role) {
            return res.status(404).json({ message: "All field are compulsory" });
        }

        const allReadyExist = await User.findOne({ email })
        if (allReadyExist) {
            return res.status(403).json({ message: "User already Exist" })
        }
        const bycrptpassword = await bycrpt.hash(password, 10)
        const user = await User.create({
            email: email,
            password: bycrptpassword,
            role:role,
            name:"",
        })

        const token = setuser(user);
        return res.status(200).json({ message: "Success", data: { token, id: user.id,role:user.role } });
    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
}

async function handlelogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "enter details correctly" })
        // throw new Error("enter details correctly")
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not exist! please sign In" })
            // throw new Error("User not exist! please sign In")
        }
        if (user && (await bycrpt.compare(password, user.password))) {
            const token = setuser(user);
            return res.status(200).json({ message: "Success", data: { token, user: user} });
        }
        else {
            return res.status(400).json({ message: "Incorrect password" })
        }
    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
}

async function getinfo(req, res) {

    try {
        const email = req.user.email;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "No user found with this email" })
        }
        return res.status(200).json({ user});
    }
    catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
}

async function updatepassword(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "No user find" })
        }
        const bycrptpassword = await bycrpt.hash(password, 10)
        const updateduser = await User.findByIdAndUpdate(user._id,
            {
                $set: {
                    password: bycrptpassword,
                }
            }
            , { new: true })
        return res.status(200).json({ message: "Password set successfully" });

    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }

}

async function generateAndSendOTP(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(403).json({ message: "User does not exist" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiryTime = Date.now() + 15 * 60 * 1000; // Set expiration time to 15 minutes
        otpStore[email] = {
            otp,
            expiresAt: expiryTime,
            isUsed: false
        };

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables for security
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your One-Time Password (OTP) for Password Reset',
            text: `
    Dear user,
    
    We received a request to reset the password for your account. Please use the following One-Time Password (OTP) to proceed with the reset:
    
    Your OTP: ${otp}
    
    This OTP is valid for one-time use only and will expire in 15 minutes. If you did not request a password reset, please ignore this email.
    
    Best regards,
    InternView` };
        const info = await transporter.sendMail(mailOptions);
        setTimeout(() => {
            delete otpStore[email]; // Remove the OTP after 15 minutes
        }, 15 * 60 * 1000);
        return res.status(200).json({ message: 'OTP sent to email successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
async function validateotp(req, res) {
    const { email, otp } = req.body;
    try {
        const storedOtpData = otpStore[email];

        if (!storedOtpData) {
            return res.status(404).json({ success: false, message: 'OTP not found or expired' });
        }

        const currentTime = Date.now();

        // Check if OTP is expired
        if (currentTime > storedOtpData.expiresAt) {
            delete otpStore[email];  // Delete expired OTP
            return res.status(400).json({ success: false, message: 'OTP is expired' });
        }

        // Check if OTP has already been used
        if (storedOtpData.isUsed) {
            delete otpStore[email];
            return res.status(400).json({ success: false, message: 'OTP is already used' });
        }

        // Check if entered OTP matches the stored OTP
        if (storedOtpData.otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Mark OTP as used
        otpStore[email].isUsed = true;
        delete otpStore[email];  // Optionally delete OTP after use
        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
}

async function sendVarifyEmailOtp(req, res) {
    const user = req.user;
    const email = user.email;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(403).json({ message: "User does not Exist" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiryTime = Date.now() + 15 * 60 * 1000; // Set expiration time to 15 minutes
        otpStore[email] = {
            otp,
            expiresAt: expiryTime,
            isUsed: false
        };

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables for security
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your One-Time Password (OTP) for Email Varification',
            text: `
    Dear user,

Thank you for registering with InternView. To complete your registration and verify your email address, please use the following One-Time Password (OTP):

Your OTP: ${otp}

This OTP is valid for one-time use only and will expire in 15 minutes. If you did not initiate this request, please ignore this email.

Verifying your email helps us ensure the security of your account.

Best regards,  
- InternView Team` };
        const info = await transporter.sendMail(mailOptions);
        // setTimeout(() => {
        //     delete otpStore[email]; // Remove the OTP after 15 minutes
        // }, 15 * 60 * 1000);
        return res.status(200).json({ message: 'OTP sent to email successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


async function validateEmailotp(req, res) {
    const user = req.user;
    const email = user.email;
    const { otp } = req.body;
    try {
        const storedOtpData = otpStore[email];

        if (!storedOtpData) {
            return res.status(404).json({ success: false, message: 'OTP not found or expired' });
        }

        const currentTime = Date.now();

        // Check if OTP is expired
        if (currentTime > storedOtpData.expiresAt) {
            delete otpStore[email];  // Delete expired OTP
            return res.status(400).json({ success: false, message: 'OTP is expired' });
        }

        // Check if OTP has already been used
        if (storedOtpData.isUsed) {
            delete otpStore[email];
            return res.status(400).json({ success: false, message: 'OTP is already used' });
        }

        // Check if entered OTP matches the stored OTP
        if (storedOtpData.otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Mark OTP as used
        otpStore[email].isUsed = true;
        delete otpStore[email];  // Optionally delete OTP after use
        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
}

async function adminAccess(req,res) {
    return res.status(200).json({message: 'This is Admin dashboard and have restricted.'})
}

async function commanAccess(req,res) {
    return res.status(200).json({message: 'This is user interface and may have limited permissions.'})
}
async function developer(req,res) {
    return res.status(200).json({message: 'Success',data:{"home": "/home   (page for every logged in user)","Admin Page":"/dashboard    (page for admin)","SignUp":"/signup  (send email,password and role in post request)","Login":"/login   (send email,password in post request)","Get Information of User":"/getinfo  (need token for validation in get request)","For send otp for emailVarification":"/emailvarification  (need token for validation in post request)","Varify Otp":"/varifyemail  (need token for validation and otp in post request)","Password Reset Otp":"/passwordresetreq   (Send email in post request)","Varify Password Reset Otp":"/validateotp   (Send otp and email in post)" ,"Reset Password":"/updatepassword (send email and new password in post request)"}})
}

module.exports = {
    handleregister,
    handlelogin,
    getinfo,
    generateAndSendOTP,
    validateotp,
    updatepassword,
    sendVarifyEmailOtp,
    validateEmailotp,
    developer,
    adminAccess,
    commanAccess
};