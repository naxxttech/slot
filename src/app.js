require('module-alias/register')
require('dotenv').config()

const { server, application_status } = require("./application/index")
const ngrok = require("ngrok")
// our db
const connectdb = require("./db/connect")
// our socket
const createSocket = require("./io/socket")


const { port, base_api_path, prefix, developmentMode } = application_status

const cmd_info = {

    homeRefeerer: `Server running on http://localhost:${port}/`,
    api: developmentMode == "development" ? `API located at http://localhost:${port}${prefix}/<query_path>`: `API located at http://localhost:${port}/${base_api_path}/<query_path>`,
    dashboard: developmentMode == "development" ? `Admin dashboard: http://localhost:${port}${prefix}/admin` : `Admin dashboard: http://localhost:${port}/admin`
}

const cmd_logs = [cmd_info.homeRefeerer, cmd_info.api, cmd_info.dashboard]


server.listen(port, () => {

    console.log(cmd_logs.join("\n"))

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