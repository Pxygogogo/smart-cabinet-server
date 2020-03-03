const jwt = require('jsonwebtoken');
const PUBLIC_URL_REGX = /\/auth/;
const PUBLIC_URL_UPLOADS = /\/upload/;
const User = require('../models/User');
module.exports = options => {
    return async (req, res, next) => {
        const {app} = options;
        if (!PUBLIC_URL_REGX.test(req.url) && !PUBLIC_URL_UPLOADS.test(req.url)) {
            let token = req.headers.authorization;
            token = String(token).substring(7);
            const {id} = jwt.verify(token, app.get('jwtKey'));
            req.id = id;
        }

        await next()
    }
};