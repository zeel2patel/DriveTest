// Function to extract validation error messages from a Mongoose error object
const extractValidationErrors = (err) => {
  // Get an array of all the validation errors from the Mongoose error object
  const validationErrors = Object.values(err.errors).map((error) => error.message);
  return validationErrors; // Return the array of validation error messages
};

module.exports = extractValidationErrors;
