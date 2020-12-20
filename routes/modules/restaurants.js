const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


// 新增餐廳
router.get('/create', (req, res) => res.render('create'))
router.post('/', (req, res) => {
  if (!req.body.image) {
    req.body.image = 'https://via.placeholder.com/600x300.png?text=Restaurants'
  }
  const restaurant = req.body
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//render show.handlebars
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})


// 編輯餐廳
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})
router.put('/:id', (req, res) => {
  const id = req.params.id
  const updated = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant = Object.assign(restaurant, updated)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})


// 刪除餐廳
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
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
  }
  Restaurant.find()
    .lean()
    .sort(order)
    .then(restaurants => res.render('index', { restaurants, sort }))
    .catch(error => console.error(error))
})

module.exports = router