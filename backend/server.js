const dotenv = require("dotenv")
const { connectDB} = require("./src/config/db")
const app = require("./src/app")
dotenv.config()

connectDB()
const port = process.env.PORT || 3000    

app.listen(port, () => console.log(`🚀 Server running ${port}`)
)