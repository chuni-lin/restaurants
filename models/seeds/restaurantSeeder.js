const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const db = mongoose.connection
const restaurantList = require('../../restaurant.json').results

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < restaurantList.length; i++) {
    Restaurant.create(restaurantList[i])
  }
  console.log('done')
})