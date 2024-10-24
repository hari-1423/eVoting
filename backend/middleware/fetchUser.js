var jwt = require('jsonwebtoken')
const JWT_SECRET = 'KMAKHIUJEN:WPJHWOEDUHWEO#IWBEI';

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add id to req body
    const token = req.header('auth-token')  // The token is fetched from the jwt's header and it is named as auth-token
    if (!token) {
        res.send(401).send({ error: 'Please authenticate using a valid token' })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)    // token which is retrived from above statement is verified with pre-defined JWT-SECRET
        req.user = data.user
        next()
    } catch (error) {
        res.send(401).send({ error: 'Please authenticate using a valid token' })
    }

}

module.exports= fetchUser