const bcrypt = require('bcrypt')

const User = require('../models/User.js')

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })
    if (userInDatabase) {
      return res.render(`./errors/oops.ejs`, { error: { message: 'Username already taken!' } })
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.render(`./errors/oops.ejs`, { error: { message: 'Password and Confirm Password must match!' } })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.body.picture
    })
    res.render('./auth/thanks.ejs')
  } catch (error) {
    console.error('⚠️ An error has occurred registering a user!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.render(`./errors/oops.ejs`, { error: { message: 'No user has been registered with that email. Please sign up!' } })
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.render(`./errors/oops.ejs`, { error: { message: 'Incorrect password! Please try again.' } })
    }
    req.session.user = {
      email: user.email,
      _id: user._id
    }
    req.session.save(() => {
      res.redirect(`/users/${user._id}`)
    })
  } catch (error) {
    console.error('⚠️ An error has occurred signing in a user!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

const signOutUser = (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/')
    })
  } catch (error) {
    console.error('⚠️ An error has occurred signing out a user!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.render(`./errors/oops.ejs`, { error: { message: 'No user with that ID exists!' } })
    }
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.render(`./errors/oops.ejs`, { error: { message: 'Your old password was not correct! Please try again.' } })
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.render(`./errors/oops.ejs`, { error: { message: 'Password and Confirm Password must match!' } })
    }
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 12)
    user.password = hashedPassword
    // It's critical that this field is updated with the password you hashed with bcrypt, and never the plain text password in req.body.password
    await user.save()
    res.render('./auth/confirm.ejs', { user })
  } catch (error) {
    console.error(
      "⚠️ An error has occurred updating a user's password!",
      error.message
    )
    res.render(`./errors/oops.ejs`, { error })
  }
}

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword
}
