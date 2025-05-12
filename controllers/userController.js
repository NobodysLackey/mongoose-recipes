const User = require('../models/User.js')

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('recipes')
    // Returns the full user object, including their hashed password. Never send this to anyone other than the user it belongs to.
    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      picture: user.picture,
      recipes: user.recipes
    }
    // Notice we have left out sensitive info like the user's email and hashed password.
    res.render('./users/profile.ejs', { user: data })
  } catch (error) {
    console.error('An error has occurred finding a user!', error.message)
  }
}

module.exports = {
  getUserById
}
