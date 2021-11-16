const ResponseSender = {
  /**
   *
   * @param {any} res the response to client
   * @param {any} data the data contains in response
   * @param {number} status the status code of response
   * @returns {object} the response object which contains data
   */
  success: (res, data, status = 200) => {
    return res.status(status).json({
      status: "success",
      data,
    });
  },
  /**
   *
   * @param {any} res the response to client
   * @param {any} err the err contains message response
   * @param {number} status the status code of response
   * @returns {object} the response object which contains err
   */
  error: (res, error, status = 400) => {
    return res.status(status).json({
      status: "failed",
      error,
    });
  },
};
export default ResponseSender;
