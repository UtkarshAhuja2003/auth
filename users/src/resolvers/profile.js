const User = require("../models/user");
const verifyJWT = require("../middlewares/auth");
const { GraphQLResponse } = require("../utils/GraphQLResponse");
const { validateName } = require("../validators/userValidator");

const updateProfile = async (_, args, context) => {
    const { name } = args.input;
    try {
        console.log(name)
        const nameValidation = await validateName(name);
        if (!nameValidation.success) return nameValidation;

        const jwtResponse = await verifyJWT(context);
        if(!jwtResponse.success) return jwtResponse;

        const user = jwtResponse.data;
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User not authenticated"], new Error().stack);
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, {
            name
        }, { new: true });
        if (!updatedUser) {
            return new GraphQLResponse(null, false, "User not found", ["User not found"], new Error().stack);
        }

        return new GraphQLResponse(updatedUser, true, "User updated successfully");
    } catch(error) {
        return new GraphQLResponse(null, false, error.message, error, error.stack);
    }
};

module.exports = {
    updateProfile
};