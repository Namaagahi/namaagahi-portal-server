const User = require('../model/User')

const handleLogout = async (req, res) => {
    // NOTE: on client side also delete the access token
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(204).json({ 'msg': 'NO CONTENT: cookie not found!' })
    const refreshToken = cookies.jwt

    // is refresh token in db
    const foundUser = await User.findOne({ refreshToken }).exec()
    if(!foundUser) {
        res.clearCookie('jwt', { httpsOnly: true, sameSite: 'None', secure: true })
        return res.status(204).json({ 'msg': 'NO CONTENT: cookie not found!' })
    }

    // deleting the refresh token in db
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)

    res.clearCookie('jwt', { httpsOnly: true, sameSite: 'None', secure: true })
    res.status(204).json({ 'msg': 'No content!' })
}

module.exports = { handleLogout }