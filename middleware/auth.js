const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return res.status(401).json({ success: false, message: 'Acccess Token not found' })

    try {
        // Check Token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
        req.body.userId = decoded.userId;

        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ success: false, message: 'Invalid Token !!!' })
    }
}

module.exports = verifyToken
