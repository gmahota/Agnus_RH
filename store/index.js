const logError = error => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  }
};

export const state = () => ({
  loginErrorMsg: null,
});
