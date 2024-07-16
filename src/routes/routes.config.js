const homeRouter = require("./home/index")
const adminRouter = require("./admin/index")
const gameRouter = require("./game/index");





const configureRoutes = (app, prefix) => {
    
    console.log("Adming page serves:", `${prefix}admin`)

    app.use('/', homeRouter);
    app.use(`${prefix}/admin`, adminRouter);
    app.use(`${prefix}/games`, gameRouter);

};



module.exports = configureRoutes