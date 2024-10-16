const validator = require("validator");
const { GraphQLResponse } = require("../utils/GraphQLResponse");

const validateUserInput = (input, type) => {
    const { name, email, password } = input;

    if (!email || !password) {
        throw new GraphQLResponse(null, false, "Email and password are required", ["Email and password must be provided"], new Error().stack);
    }
    if (!validator.isEmail(email)) {
        throw new GraphQLResponse(null, false, "Invalid email address", ["The provided email is not valid"], new Error().stack);
    }
    if (password.length < 8) {
        throw new GraphQLResponse(null, false, "Password must be at least 8 characters long", ["Password must be at least 8 characters"], new Error().stack);
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()]/.test(password)) {
        throw new GraphQLResponse(null, false, "Password must contain one lowercase, uppercase, number, and special character", ["Password must meet complexity requirements"], new Error().stack);
    }

    if (type === "register") {
        if (!name) {
            throw new GraphQLResponse(null, false, "All fields are required", ["Name is required for registration"], new Error().stack);
        }
        if (name.length < 2 || name.length > 200) {
            throw new GraphQLResponse(null, false, "Name should be between 2 and 200 characters", ["Name length is invalid"], new Error().stack);
        }
    }
};

module.exports = {
    validateUserInput
};
