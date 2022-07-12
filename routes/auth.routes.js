// routes/auth.routes.js
const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10
 
// GET route ==> to display the signup form to users
 router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')})
// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                password: hashedPassword
            })
        })
        .then(createdUser => {
            console.log('Hello new user: ', createdUser)
            res.redirect('/')
        })
        .catch(error => next(error))
})
// GET route ==> to display login form to users
router.get('/login', (req, res, next) => {
    res.render('auth/login.hbs')
})
// POST route ==> to process form data
router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    User.findOne({username})
        .then(user => {
            bcryptjs.compareSync(password, user.password)
            req.session.currentUser = user
            res.redirect('/userProfile')
        })
        .catch(error => next(error))
})

router.get('/userProfile', (req, res, next) => {
    res.render('users/user-profile', {userSession: req.session.currentUser})
})

module.exports = router;