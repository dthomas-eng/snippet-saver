const thrownErrorFormatter = (msg) => {
  return {
    errors: [
      {
        message: msg,
      },
    ],
  };
};

module.exports = thrownErrorFormatter;
