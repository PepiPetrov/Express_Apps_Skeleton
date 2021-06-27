const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { isAuth, isGuest } = require('../middlewares')
const { COOKIE_NAME, TOKEN_SECRET } = require('../config')
const service = require('./service')

router.get('/register', isGuest(), (req, res) => {
    res.render('auth/register')
})

router.post('/register', isGuest(), async (req, res) => {
    const errors = []
    const values = { username: req.body.username, password: req.body.password, rePass: req.body.rePass }
    if (req.body.username == '') {
        errors.push('Username is required!')
        delete values['username']
    }
    if (req.body.password == '') {
        errors.push('Password is required!')
        delete values['password']
        delete values['rePass']
    }
    if (req.body.password !== req.body.rePass) {
        errors.push('Passwords don\'t match!')
        delete values['password']
        delete values['rePass']
    }
    if (errors.length > 0) {
        res.render('auth/register', { error: errors.join('\n'), username: values.username, password: values.password, rePass: values.rePass })
        return
    }
    try {
        const data = await service.register(req.body.username, req.body.password)
        const token = jwt.sign(data, TOKEN_SECRET, { expiresIn: 360000 })
        res.cookie(COOKIE_NAME, token)
    } catch (e) {
        delete values['username']
        errors.push(e.message)
        res.render('auth/register', { error: errors.join('\n'), username: values.username, password: values.password, rePass: values.rePass })
        return
    }

    res.redirect('/')
})

router.get('/login', isGuest(), (req, res) => {
    res.render('auth/login')
})

router.post('/login', isGuest(), async (req, res) => {
    const errors = []
    const values = { username: req.body.username, password: req.body.password }
    if (req.body.username == '') {
        errors.push('Username is required!')
        delete values['username']
    }
    if (req.body.password == '') {
        errors.push('Password is required!')
        delete values['password']
    }
    try {
        const data = await service.login(req.body.username, req.body.password)
        const token = jwt.sign(data, TOKEN_SECRET, { expiresIn: 360000 })
        res.cookie(COOKIE_NAME, token)
    } catch (e) {
        if (e.message.includes('User')) {
            delete values['username']
            delete values['password']
        } else if (e.message.includes('password!')) {
            delete values['password']
        }
        errors.push(e.message)
    }
    if (errors.length > 0) {
        return res.render('auth/login', { error: errors.join('\n'), username: values.username, password: values.password })
    }
    res.redirect('/')
})

router.get('/logout', isAuth(), (req, res) => {
    res.clearCookie('auth')
    res.redirect('/')
})

module.exports = router