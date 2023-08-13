const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: '!' })
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token!' })
      }

      // Set the JWT token as an HttpOnly cookie using cookie-parser
      const cookieOptions = {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain:'portal.namaagahi.com' ,
        sameSite: 'Lax'
      }
      res.cookie('jwt', token, cookieOptions)
      req.cookies = cookieParser.JSONCookies(req.cookies)

      // Set decoded user information to the request object
      req.user = decoded.UserInfo.username
      req.user = decoded.UserInfo.name
      req.user = decoded.UserInfo.avatar
      req.roles = decoded.UserInfo.roles

      next()
    }
  )
}

module.exports = verifyJWT