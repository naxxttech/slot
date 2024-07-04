require('module-alias/register')

const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const cors = require("cors")

const app = express()
const port = 3300

// static 
app.use(express.static("public"))
app.use("/css", express.static(__dirname + "public/css"))

// middlewares
app.use(cors())
app.use(expressLayouts)

// view
app.set("view engine", "ejs")
app.set("layout", "./layouts/base")
app.set("views", __dirname + "/views")

const base_api_path = "/api/v1"

// Routes
const adminRouter = require('./admin.routes/admin')

// API Resources
const oceanAPI = require('./modules/ocean/routes/game')




app.get("/", (req, res) => {

    res.redirect("/admin")
})

// routers
app.use(adminRouter)
// apis
app.use(base_api_path, oceanAPI)

app.listen(port, () => {

    console.log(`Server running on http://localhost:${port}/`)
    console.log(`API located at http://localhost:${port}${base_api_path}/<query_path>`)
    console.log(`Admin dashboard: http://localhost:${port}/admin`)
})