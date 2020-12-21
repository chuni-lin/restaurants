const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  name_en: String,
  image: String,
  google_map: String,
  rating: Number,
  description: String
})
module.exports = mongoose.model('Restaurant', restaurantSchema)