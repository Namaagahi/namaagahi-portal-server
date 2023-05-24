const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logEvents')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 
        { message: 'تعداد تلاش بیش از حد! لطفا بعدا تلاش کنید'},
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = loginLimiter