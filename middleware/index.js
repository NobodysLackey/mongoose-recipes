const isSignedIn = (req, res, next) => {
  if (req.session.user) {
    return next()
  }
  res.redirect("/auth/sign-in")
}

const passUserToView = (req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null
  next()
}

module.exports = {
  isSignedIn,
  passUserToView
}
