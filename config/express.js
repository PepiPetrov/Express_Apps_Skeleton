const express = require('express')
const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.urlencoded({ extended: false }))

app.use('/static', express.static('static'))

app.use(cookieParser('luisfonsi'))

app.engine('hbs', hbs({
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

module.exports = app