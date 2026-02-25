const User = require('../models/User.js')
const Recipe = require('../models/Recipe.js')

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // Returns the full user object, including their hashed password. Never send this to anyone other than the user it belongs to.
    const recipes = await Recipe.find({ author: user._id })
    // Returns all recipes where the author field is the same as the user object ID from above.
    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      picture: user.picture,
      recipes: recipes
    }
    // Notice you have left out sensitive info like the user's email and hashed password.
    // You have also added the recipes to the response.
    res.render('./users/profile.ejs', { user: data })
  } catch (error) {
    console.error('⚠️ An error has occurred finding a user!', error.message)
    res.render(`./errors/oops.ejs`, { error })
  }
}

module.exports = {
  getUserById
}
