if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')
const User = require('../user')
const bcrypt = require('bcryptjs')
const restaurantList = require('../../restaurant.json').results
const SEED_USERS = [
  {
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    email: 'user2@example.com',
    password: '12345678'
  }
]


db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USERS[0].password, salt))
    .then(hash => {
      SEED_USERS.forEach(SEED_USER => SEED_USER.password = hash)
      return User.insertMany(SEED_USERS)
    })
    .then(users => {
      return Promise.all(restaurantList.map((restaurant, index) => {
        if (index < 3) {
          restaurant.userId = users[0]._id
          return Restaurant.create(Object.assign({}, restaurant))
        }
        if (index < 6) {
          restaurant.userId = users[1]._id
          return Restaurant.create(Object.assign({}, restaurant))
        }
      }))
    })
    .then(() => {
      console.log('Done.')
      process.exit()
    })
})