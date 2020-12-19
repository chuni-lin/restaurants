const express = require('express')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const comparison = hbshelpers.comparison()
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')

app.engine('handlebars', exphbs({ helpers: comparison, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use((bodyParser.urlencoded({ extended: true })))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})






