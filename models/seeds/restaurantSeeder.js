const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results

db.once('open', () => {
  for (let i = 0; i < restaurantList.length; i++) {
    Restaurant.create(restaurantList[i])
  }
  console.log('done')
})