class GraphQLResponse {
    /**
     * @param {any} data - The data to be returned in the response.
     * @param {string} message - A success message.
     */
    constructor(data, message = "Success") {
      this.data = data;
      this.message = message;
      this.success = true;
      this.errors = null;
      this.stack = null;
    }
  }
  
  export { GraphQLResponse };
  