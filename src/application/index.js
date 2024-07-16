const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const cors = require("cors")
const path = require('path');

const http = require("http")
const app = express()
const server = http.createServer(app);
const configureRoutes = require("../routes/routes.config")

// static paths
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

// middlewares
app.use(cors())
app.use(expressLayouts)
// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// view
app.set("view engine", "ejs")
app.set("layout", "./layouts/base")
app.set("views", path.join(__dirname, '../views'));


// regular config
const port = process.env["PORT"]
const developmentMode = process.env["NODE_ENV"]
const prefix = process.env.prefix || '';
const base_api_path = "api/v1"


const application_status = {

    developmentMode,
    prefix,
    base_api_path,
    port
}

// group routes
configureRoutes(app, prefix)


module.exports = { server, application_status }