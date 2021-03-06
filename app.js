const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const comparison = hbshelpers.comparison()
const bodyParser = require('body-parser')
const app = express()
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
require('./config/mongoose')

const usePassport = require('./config/passport')

app.engine('handlebars', exphbs({ helpers: comparison, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use((bodyParser.urlencoded({ extended: true })))
app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.loginError = req.flash('error')
  next()
})
app.use(routes)


app.listen(process.env.PORT, () => {
  console.log(`Express is running on http://localhost:${process.env.PORT}`)
})






