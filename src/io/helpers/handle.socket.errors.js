const handleErrorsIfAny = async (fn, socket) => {
    try {
      await fn();
    } catch (error) {
      console.error('An error occured in socket:', error.message);
    //   socket.emit('error', { message: error.message });
      socket.disconnect(true);
    }
  };


  module.exports = handleErrorsIfAny