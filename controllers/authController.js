const User = require('../models/userModel');

const bcrypt = require('bcryptjs');

exports.signUp = async (req, res, next) => {
    const {username, password} = req.body

    try {
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashpassword
        });
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            },
        });
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        });
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username})

        if (!user) {
            res.status(400).json({
                status: "fail",
                message: 'user not found'
            })
        }

        const isCorret = await bcrypt.compare(password, user.password)

        if (!isCorret) {
            req.session.user = user; // password to bycrypt
            res.status(200).json({
                status: 'success'
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            })
        }
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        });
    }
}