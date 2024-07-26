class HttpError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }


const handlePotentialErrors = (fn) => (request, response, next) => {
    Promise.resolve(fn(request, response, next)).catch(next);
  };
  


  const errorHandler = (error, request, response, next) => {
    console.error("stack:", error);

    const statusCode = error.statusCode || 500
    response.status(statusCode).json({
      code: statusCode,
      message: error.message,
    });
  };




  module.exports = { handlePotentialErrors, errorHandler, HttpError }