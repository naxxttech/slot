const express = require("express")
const cors = require("cors")

const app = express()
const port = 3300


// middlewares
app.use(cors())


// Routes
const gameAPI = require('./routes/game')

app.get("/", (req, res) => {

    res.send("Pong")
})

// api 
const base_api_path = "/api/v1"

app.use(base_api_path, gameAPI)

app.listen(port, () => {

    console.log(`Server running on http://localhost:${port}/`)
    console.log(`API located at http://localhost:${port}${base_api_path}/<query_path>`)
})