var express = require('express');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(8);
var jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { authHandler } = require('../middlewares/auth.middleware');
const router = express.Router();
require('dotenv').config();

function accessDenial(req, res) {
    return res.status(401).json({ message: 'Bad Request' });
}

router.route('/register')
    .get(accessDenial)
    .post(async (req, res) => {
        const { name, email, password } = req.body;
        if (name && email && password) {
            try {
                const checkEmail = await User.findOne({ email });
                if (!checkEmail) {
                    const hashedPassword = bcrypt.hashSync(password, salt);
                    await User.create({ name, email, password: hashedPassword });
                    res.status(201).json({ success: true, message: "user registration Successful" })
                } else {
                    res.status(409).json({ status: false, message: "email id already exist" });
                }
            }
            catch (error) {
                console.log("error in user registration", error);
                res.status(412).json({ success: false, message: "error while registering the user" });
            }
        }
        else {
            res.status(412).json({ success: false, message: "insufficient data" });
        }
    })

router.route('/login')
    .get(accessDenial)
    .post(async (req, res) => {
        const { email, password } = req.body;
        if (email && password) {
            try {
                const user = await User.findOne({ email })
                if (user === null) {
                    return res.status(403).json({ success: false, message: 'User Not Found' })
                } else {
                    const checkPassword = bcrypt.compareSync(password, user.password)
                    if (!checkPassword) {
                        return res.status(409).json({ success: false, message: 'Invalid Credentials' });
                    } else {
                        const token = jwt.sign({ userId: user._id }, process.env['secret_key'], { expiresIn: '24h' })
                        res.status(200).json({ success: true, message: "Login Successful", token })
                    }
                }
            }
            catch (error) {
                console.log("error in user login", error);
                res.status(412).json({ success: false, message: "error while login in the user" });
            }
        }
        else {
            res.status(412).json({ success: false, message: "insufficient data" });
        }
    })

router.route('/result')
    .get(authHandler, async (req, res) => {
        const { userId } = req.user;
        if (userId) {
            try {
                const certificate = await User.findOne({ _id: userId }).populate('attemptedQuiz.quizId').exec();
                const { attemptedQuiz } = certificate;
                const quizCertificateData = await attemptedQuiz.map(({
                    quizId,
                    score
                }) => {
                    return {
                        name: quizId.quizName,
                        score
                    }
                })
                res.status(200).json({ success: true, quizCertificateData });
            } catch (error) {
                console.log('error in getting certificate', error)
                res.status(409).json({ success: false, message: "error in getting certificate" })
            }
        } else {
            res.status(412).json({ success: false, message: "insufficient data" });
        }
    })
    .post(authHandler, async (req, res) => {
        const { userId } = req.user;
        const { quizId, score } = req.body;
        if (userId && quizId && score) {
            const { attemptedQuiz } = await User.findById({ _id: userId });
            const checkQuizId = attemptedQuiz.filter((i) => {
                if (i.quizId == quizId) {
                    return i;
                }
            });
            if (checkQuizId.length === 0) {
                try {
                    const response = await User.findOneAndUpdate({ _id: userId }, { $push: { attemptedQuiz: { quizId, score } } }).exec();
                    res.json({ success: true, message: "certificate created", response })
                } catch (error) {
                    console.log("error while updating user certificate", error)
                    res.status(500).json({ success: false, message: "error while updating user certificate" })
                }
            }
            else {
                res.status(400).json({ success: false, message: "cannot attempt same quiz twice" });
            }
        } else {
            res.status(412).json({ success: false, message: "insufficient data" });
        }
    })

module.exports = router;