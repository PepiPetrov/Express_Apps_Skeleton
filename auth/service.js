const SALT_ROUNDS = require('../config/index').SALT_ROUNDS
const bcrypt = require('bcrypt')
const dbConnect = require('../config/dbConnect')
const User = require('./User')
dbConnect()

async function register(username, password) {
    const usernameExists = await User.findOne({ username: username })
    if (usernameExists) {
        throw new Error('Username already taken!')
    }
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS)
    await User.create({ username, password: hashedPass })
    return await login(username, password)
}

async function login(username, password) {
    console.log(await User.find({}));
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error('User not found!')
    }
    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword) {
        throw new Error('Wrong password!')
    }
    return { username: user.username, id: user._id }
}

module.exports = { register, login }