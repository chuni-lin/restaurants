const express = require('express')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const comparison = hbshelpers.comparison()
const mongoose = require('mongoose')
const db = mongoose.connection
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const methodOverride = require('method-override')
const routes = require('./routes')

app.engine('handlebars', exphbs({ helpers: comparison, defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use((bodyParser.urlencoded({ extended: true })))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})

// 連線資料庫
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', () => console.log('MongoDB error!'))
db.once('open', () => console.log('MongoDB connected!'))




