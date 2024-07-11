require('module-alias/register')
require('dotenv').config()


const ngrok = require("ngrok")
const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const cors = require("cors")
const path = require('path');

const http = require("http")
const app = express()
const port = process.env["PORT"]
const server = http.createServer(app);
// our db
const connectdb = require("./db/connect")
// our socket
const createSocket = require("./io/socket")
// static 
app.use(express.static("public"))
app.use('/css', express.static(path.join(__dirname, 'public/css')));
// middlewares
app.use(cors())
app.use(expressLayouts)
// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// view
app.set("view engine", "ejs")
app.set("layout", "./layouts/base")
app.set("views", __dirname + "/views")

const base_api_path = "/api/v1"

// Routes
const adminRouter = require('./admin.routes/admin')

// API Resources
const oceanAPI = require('./modules/ocean/routes/spin')

// db ile bağlantıyı kur
connectdb()

app.get("/", (req, res) => {

    res.redirect("/admin")
})

// routers
app.use("/admin", adminRouter)
// apis
app.use(base_api_path, oceanAPI)


const developmentMode = false

server.listen(port, () => {

    console.log(`Server running on http://localhost:${port}/`)
    console.log(`API located at http://localhost:${port}${base_api_path}/<query_path>`)
    console.log(`Admin dashboard: http://localhost:${port}/admin`)

    // start socket
    createSocket(server)

    if (developmentMode) {
            // create tunnel
            ngrok.connect(port).then(tunnelURL => {

                console.log("PUBLIC TUNNEL:", tunnelURL)

            }).catch(error => console.log("Tunnel error:", error))

    }

})


