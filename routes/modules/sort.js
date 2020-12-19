const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 餐廳排序
router.get('/:sort/:order', (req, res) => {
  const sort = req.params.sort
  const order = req.params.order
  Restaurant.find()
    .lean()
    .sort({ [sort]: [order] })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

module.exports = router