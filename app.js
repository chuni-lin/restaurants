const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results
const mongoose = require('mongoose')
const db = mongoose.connection
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use((bodyParser.urlencoded({ extended: true })))
app.use(express.static('public'))
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})

// 連線資料庫
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
db.on('error', () => console.log('MongoDB error!'))
db.once('open', () => console.log('MongoDB connected!'))

//載入資料庫
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// 新增餐廳
app.get('/restaurants/create', (req, res) => res.render('create'))
app.post('/restaurants', (req, res) => {
  if (req.body.image.length === 0) { req.body.image = 'https://www.teknozeka.com/wp-content/uploads/2020/03/wp-header-logo-33.png' }
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//render show.handlebars
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})


app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const restaurants = restaurantList.results.filter(item =>
    item.name.toLowerCase().includes(keyword.toLowerCase()) ||
    item.category.toLowerCase().includes(keyword.toLowerCase())
  )
  res.render('index', { restaurants, keyword })
})

