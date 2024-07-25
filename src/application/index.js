const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const cors = require("cors")
const path = require('path');

const http = require("http")
const app = express()
const server = http.createServer(app);
const configureRoutes = require("../routes/routes.config")
const dynamicURLs = require("../middlewares/seturl")
const session = require('express-session')

// use session

const min20 = 20 * 60 * 1000
const min1 = 1 * 60 * 1000

const sessionMiddleWare = session({

    secret: process.env["COOKIESCT"],
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: min20 // oturum süresi 20 dk
    }
})


app.use(sessionMiddleWare)
// urls
app.use(dynamicURLs)
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
const base_api_path = "api/v1"




const isDevelopment = process.env.NODE_ENV === 'development';
const prefix = isDevelopment ? '/api' : '';

// group routes
configureRoutes(app, prefix)


const application_status = {

    developmentMode,
    prefix,
    base_api_path,
    port
}



module.exports = { server, application_status, sessionMiddleWare }