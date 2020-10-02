const errorMessageAssembler = (errorObject) => {
  let errorMessage = "";

  if (typeof errorObject === "object" && errorObject !== null) {
    if (errorObject.errors) {
      Object.values(errorObject.errors).forEach(
        (error) => (errorMessage += error.message)
      );
    } else {
      errorMessage = String(errorObject);
    }
  } else {
    errorMessage = errorObject;
  }
  return errorMessage;
};

module.exports = errorMessageAssembler;
