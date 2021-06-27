const mongoose = require('mongoose')
const dbName = require('./index').DB_NAME

function conn() {
    mongoose.connect('mongodb://localhost/'+dbName, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true
    })
}

module.exports = conn