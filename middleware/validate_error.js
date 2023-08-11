
const extractValidationErrors = (err) => {
    const validationErrors = Object.values(err.errors).map((error) => error.message);
    return validationErrors;
  };
  
module.exports = extractValidationErrors;
  