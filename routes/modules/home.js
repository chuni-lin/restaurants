const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//載入資料庫
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

module.exports = router