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


// 搜尋餐廳
router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword.trim()
  Restaurant.find({ userId })
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


// 新增餐廳
router.get('/create', (req, res) => res.render('create'))
router.post('/', (req, res) => {
  if (!req.body.image) {
    req.body.image = 'https://via.placeholder.com/600x300.png?text=Restaurants'
  }
  const restaurant = req.body
  restaurant.userId = req.user._id
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/restaurants'))
    .catch(error => console.log(error))
})


// render show.handlebars
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})


// 編輯餐廳
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const updated = req.body
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant = Object.assign(restaurant, updated)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})


// 刪除餐廳
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/restaurants'))
    .catch(error => console.log(error))
})


// 餐廳排序
router.get('/', (req, res) => {
  const sort = req.query.sort
  let order = {}
  switch (sort) {
    case 'name_asc':
      order = { name: 'asc' }
      break
    case 'name_desc':
      order = { name: 'desc' }
      break
    case 'category':
      order = { category: 'asc' }
      break
    case 'location':
      order = { location: 'asc' }
      break
    case 'rating':
      order = { rating: 'desc' }
      break
  }
  Restaurant.find()
    .lean()
    .sort(order)
    .then(restaurants => res.render('index', { restaurants, sort }))
    .catch(error => console.error(error))
})

module.exports = router