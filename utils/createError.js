module.exports = (message, statusCode) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  throw error;
};
