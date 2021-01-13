const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const comparison = hbshelpers.comparison()
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

const usePassport = require('./config/passport')

app.engine('handlebars', exphbs({ helpers: comparison, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use((bodyParser.urlencoded({ extended: true })))
app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})
app.use(routes)


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})






