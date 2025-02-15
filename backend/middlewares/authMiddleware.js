const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListTokenModel');
const adminModel = require('../models/adminModel');

module.exports.authAdmin = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorize' });
    }


    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorizedd' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(decoded._id)

        req.admin = admin;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorizeddd' });
    }
}
