const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const mongoose = require('mongoose')
const db = mongoose.connection
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})

// 連線資料庫
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', () => console.log('MongoDB error!'))
db.once('open', () => console.log('MongoDB connected!'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.id)
  res.render('show', { restaurant })
})
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const restaurants = restaurantList.results.filter(item =>
    item.name.toLowerCase().includes(keyword.toLowerCase()) ||
    item.category.toLowerCase().includes(keyword.toLowerCase())
  )
  res.render('index', { restaurants, keyword })
})

