require('dotenv').config({ quiet: true })
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')

const { MongoStore } = require("connect-mongo")

const path = require("path")

const middleware = require("./middleware")

const authRouter = require('./routes/authRouter.js')
const userRouter = require('./routes/userRouter.js')
const recipeRouter = require('./routes/recipeRouter.js')

const PORT = process.env.PORT ? process.env.PORT : 3000

// If dealing with MongoDB connection issues, uncomment the lines below...

// const dns = require('dns')
// dns.setServers(['8.8.8.8', '1.1.1.1'])

const db = require('./db')
db.connect()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
)
app.use(middleware.passUserToView)

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/recipes', recipeRouter)

app.get('/', (req, res) => {
  res.render('./index.ejs')
})

app.listen(PORT, () => {
  console.log(`🥘 Mongoose Recipes Server is cooking on Port ${PORT} . . .`)
})
