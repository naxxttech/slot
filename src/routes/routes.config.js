const homeRouter = require("./home/index")
const adminRouter = require("./admin/index")
const gameRouter = require("./game/index")

const configureRoutes = (app) => {
    
    const api_root_endpoint = "/api/v1";

    app.use('/', homeRouter);
    app.use("/admin", adminRouter);
    app.use(`${api_root_endpoint}/games`, gameRouter);

};



module.exports = configureRoutes