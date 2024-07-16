require('module-alias/register')
require('dotenv').config()

const { server } = require("./application/index")
const port = process.env["PORT"]
const ngrok = require("ngrok")

// our db
const connectdb = require("./db/connect")
// our socket
const createSocket = require("./io/socket")


const base_api_path = "/api/v1"

/*
// Routes
const adminRouter = require('./admin.routes/admin')
// API Resources
const oceanAPI = require('./modules/ocean/routes/spin')



// routers
app.use("/admin", adminRouter)
// apis
app.use(base_api_path, oceanAPI)

*/

const developmentMode = process.env["NODE_ENV"]

server.listen(port, () => {

    console.log(`Server running on http://localhost:${port}/`)
    console.log(`API located at http://localhost:${port}${base_api_path}/<query_path>`)
    console.log(`Admin dashboard: http://localhost:${port}/admin`)

    // start socket
    createSocket(server)

    /*
    if (developmentMode) {
            // create tunnel
            ngrok.connect(port).then(tunnelURL => {

                console.log("PUBLIC TUNNEL:", tunnelURL)

            }).catch(error => console.log("Tunnel error:", error))

    }
    */

})


// db ile bağlantıyı kur
connectdb()