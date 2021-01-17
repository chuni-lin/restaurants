const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/users/login#login-form',
  failureFlash: true
}))


router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields should be filled in.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Your password and confirmation password do not match.' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: 'Email address is already registered.' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash,
        }))
        .then(() => res.redirect('/restaurants'))
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', "You've been successfully logged out.")
  res.redirect('/users/login#login-form')
})

module.exports = router