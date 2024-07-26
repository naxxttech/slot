
const createResponseObject = (code, message, resource = null) => {
    return {
        code,
        message,
        resource
    };
};


module.exports = createResponseObject