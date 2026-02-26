const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {authRouter} = require('./routes/authRoute')
const incomeRouter = require('./routes/incomeRoute')
const expenseRouter = require('./routes/expanceRoute')
const dashboardRouter = require('./routes/dashboardRoute')
require("dotenv").config();
const app = express()

app.use(express.json())
app.use(cookieParser())

  
app.use( cors({ 
    origin: [
      process.env.BASE_URL,
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRouter)
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter)
app.use("/api/dashboard", dashboardRouter)


module.exports = app 