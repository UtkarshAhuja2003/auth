class GraphQLResponse {
    /**
     * @param {any} data - The data to be returned in the response.
     * @param {string} message - A message.
     * @param {string[]} errors - An array of errors.
     * @param {string} stack - The error stack
     * @param {boolean} success - A boolean indicating if the operation was successful.
     */
    constructor(data, success = false, message = "Success", errors = null, stack = null) {
      this.data = data;
      this.message = message;
      this.success = success;
      this.errors = errors;
      this.stack = stack;
    }
  }
  
module.exports = { GraphQLResponse };
  