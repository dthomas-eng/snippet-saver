const validateUser = () => {
  return new Promise(function (resolve, reject) {
    const token = localStorage.getItem("snippet-auth");
    if (token) {
      fetch("/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success === true) {
            resolve(res.data);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.error(err.message);
          reject(err);
        });
    }
  });
};

module.exports = validateUser;
