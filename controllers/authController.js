const bcrypt = require('bcrypt')

const User = require('../models/User.js')

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ email: req.body.email })
    if (userInDatabase) {
      return res.send('Username already taken!')
      // This will be an EJS page later...
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
      // This will be also be an EJS page...
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.body.picture,
      recipes: []
    })
    res.render('./auth/thanks.ejs', { user })
  } catch (error) {
    console.error('An error has occurred registering a user!', error.message)
  }
}

const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.send(
        'No user has been registered with that email. Please sign up!'
      )
      // This will be an EJS page later...
    }
    const validPassword = bcrypt.compareSync(req.body.password, user.password)
    if (!validPassword) {
      return res.send('Incorrect password! Please try again.')
      // This will be also be an EJS page...
    }
    req.session.user = {
      email: user.email,
      _id: user._id
    }
    res.redirect(`/users/${user._id}`)
  } catch (error) {
    console.error('An error has occurred signing in a user!', error.message)
  }
}

const signOutUser = (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    console.error('An error has occurred signing out a user!', error.message)
  }
}

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.send('No user with that ID exists!')
      // This will be an EJS page later...
    }
    const validPassword = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.send('Your old password was not correct! Please try again.')
      // This will be also be an EJS page...
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match')
      // This will be also be an EJS page...
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12)
    user.password = hashedPassword
    // It's critical that this field is updated with the password we hashed with bcrypt, and never the plain text password in req.body.password
    await user.save()
    res.send(`Your password has been updated, ${user.first}!`)
    // This will be an EJS page later...
  } catch (error) {
    console.error(
      "An error has occurred updating a user's password!",
      error.message
    )
  }
}

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword
}
