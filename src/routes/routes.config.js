const homeRouter = require("./home/index")
const adminRouter = require("./admin/index")
const gameRouter = require("./game/index");
const authRouter = require("./auth/index");




const configureRoutes = (app, prefix) => {
    
    let api_enpoint = prefix
    if (!api_enpoint) api_enpoint = "/api/v1"
    console.log("api:", api_enpoint)

    app.use('/', homeRouter);
    app.use(`${prefix}/admin`, adminRouter);
    app.use(`${api_enpoint}/games`, gameRouter);
    app.use(`${api_enpoint}/auth`, authRouter);


    // error page
    app.use((request, response, next) => {
        response.redirect(`${prefix}/admin`);
    });

};



module.exports = configureRoutes