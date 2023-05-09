const express = require('express')
const router = express.Router()
const path = require('path')

router.get('^/$|/index(.html)?', (req, res) => {
    // res.send('Hello World') Sending an string to show to display on browser
    // res.sendFile('./views/index.html', { root: __dirname }) // Sending html file to display on browser
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html')) // Sending html file to display on browser solution 2
})
// Adding a new route
router.get('/new-page(.html)?', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html')))
// Redirecting old routes
router.get('/old-page(.html)?', (req, res) => res.redirect(301, '/new-page.html'))

// middleware usage example
router.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html')
    next()
}, (req, res) => res.send('Hello World'))

module.exports = router
