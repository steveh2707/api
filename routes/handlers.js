function errorHandler(errorMessage, errorDetails) {
  return {
    success: false,
    message: errorMessage,
    errorDetails
  }
}

function dataHandler(dataMessage, data) {
  return {
    success: true,
    message: dataMessage,
    data
  }
}

module.exports = {
  errorHandler,
  dataHandler
}