const app = require('./config/express')
const auth=require('./auth/auth.router')

app.use('/auth',auth)

app.listen(3000)