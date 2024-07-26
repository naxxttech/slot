const handlePotentialErrors = (fn) => (request, response, next) => {
    Promise.resolve(fn(request, response, next)).catch(next);
  };
  


  const errorHandler = (error, request, response, next) => {
    console.error(error.stack);

    response.status(500).json({
      success: false,
      message: error.message,
    });
  };




  module.exports = { handlePotentialErrors, errorHandler }