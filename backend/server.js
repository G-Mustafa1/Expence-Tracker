const dotenv = require("dotenv")
const { connectDB} = require("./src/config/db")
const app = require("./src/app")
dotenv.config()

connectDB()

app.get('/', (req, res) => {
  res.send('Backend is running 🚀')
})

app.get('/about', (req, res) => {
  res.send('About route 🎉')
})

const port = process.env.PORT || 3000    

app.listen(port, () => console.log(`🚀 Server running ${port}`)
)