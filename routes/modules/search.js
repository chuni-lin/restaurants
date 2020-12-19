const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 搜尋餐廳
router.get('/', (req, res) => {
  const keyword = req.query.keyword.trim()
  Restaurant.find()
    .lean()
    .then(list => {
      const restaurants = list.filter(item => {
        return item.category.includes(keyword) ||
          item.name.toLowerCase().includes(keyword.toLowerCase())
      })
      return (!restaurants.length) ? res.render('noResult', { keyword }) : res.render('index', { restaurants, keyword })
    })
    .catch(error => console.log(error))
})

module.exports = router