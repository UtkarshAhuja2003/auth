const validator = require("validator");
const { GraphQLResponse } = require("../utils/GraphQLResponse");

const validateName = async (name) => {
    if (!name) {
        return new GraphQLResponse(null, false, "Name is required", ["Name is required"], new Error().stack);
    }
    if (name.length < 2 || name.length > 200) {
        return new GraphQLResponse(null, false, "Name should be between 2 and 200 characters", ["Name length is invalid"], new Error().stack);
    }
    return new GraphQLResponse(null, true, "Name is valid");
};

const validateEmail = async (email) => {
    if (!email) {
        return new GraphQLResponse(null, false, "Email is required", ["Email is required"], new Error().stack);
    }
    if (!validator.isEmail(email)) {
        return new GraphQLResponse(null, false, "Invalid email address", ["The provided email is not valid"], new Error().stack);
    }
    return new GraphQLResponse(null, true, "Email is valid");
}

const validatePassword = async(password) => {
    if (!password) {
        return new GraphQLResponse(null, false, "Password is required", ["Password is required"], new Error().stack);
    }
    if (password.length < 8) {
        return new GraphQLResponse(null, false, "Password must be at least 8 characters long", ["Password must be at least 8 characters"], new Error().stack);
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()]/.test(password)) {
        return new GraphQLResponse(null, false, "Password must contain one lowercase, uppercase, number, and special character", ["Password must meet complexity requirements"], new Error().stack);
    }
    return new GraphQLResponse(null, true, "Password is valid");
}

const validateUserInput = async (input, type) => {
    const { name, email, password } = input;

    const emailValidation = await validateEmail(email);
    if(emailValidation.success === false) {
        return emailValidation;
    }
    const passwordValidation = await validatePassword(password);
    if(passwordValidation.success === false) {
        return passwordValidation;
    }

    if (type === "register") {
        const nameValidation = await validateName(name);
        if(nameValidation.success === false) {
            return nameValidation;
        }
    }

    return new GraphQLResponse(null, true, "Input validation successful");
};

module.exports = {
    validateUserInput,
    validateName,
    validateEmail,
    validatePassword
};
