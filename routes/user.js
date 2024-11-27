const express = require('express');
const { handleregister, handlelogin, getinfo, generateAndSendOTP, validateotp, updatepassword, sendVarifyEmailOtp, validateEmailotp, commanAccess,adminAccess,developer } = require('../controller/usercontroller')
const { validation,authorizeRoles } = require('../services/userServices')
const router = express.Router();

router.get('/',developer);
router.get('/home',validation,commanAccess);
router.get('/dashboard',authorizeRoles("admin"),adminAccess);
router.post('/signin', handleregister);
router.post('/login', handlelogin)
router.get('/getinfo', validation, getinfo)

router.post('/emailvarification', validation, sendVarifyEmailOtp)
router.post('/varifyemail', validation, validateEmailotp)

router.post('/passwordresetreq', generateAndSendOTP) //send email
router.post('/validateotp', validateotp) //send email and otp
router.post('/updatepassword', updatepassword) //send email and password



module.exports = router