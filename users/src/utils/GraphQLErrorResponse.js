class GraphQLErrorResponse {
    /**
     * @param {string} message - An error message.
     * @param {any[]} errors - List of detailed error messages (if any).
     * @param {string} stack - Stack trace for debugging (optional in production).
     */
    constructor(message = "Something went wrong", errors = [], stack = "") {
      this.data = null;
      this.message = message;
      this.success = false;
      this.errors = errors;
      this.stack = stack || null;
    }
  }
  
  export { GraphQLErrorResponse };
  