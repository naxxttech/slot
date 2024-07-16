



const set_url = (request, response, next) => {

    const { application_status } = require("../application");

    const prefix = application_status.prefix


    if (prefix) {

        response.locals.prefix = prefix;
    }

 
    next();
};




module.exports = set_url