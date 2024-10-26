const User = require("../models/user");
const verifyJWT = require("../middlewares/auth");
const { GraphQLResponse } = require("../utils/GraphQLResponse");
const { validateName, validatePassword, validateEmail } = require("../validators/userValidator");

const updateProfile = async (_, args, context) => {
    const { name, email } = args.input;
    try {
        const jwtResponse = await verifyJWT(context);
        if (!jwtResponse.success) return jwtResponse;

        const user = jwtResponse.data;
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User not authenticated"], new Error().stack);
        }

        if(!name && !email) {
            return new GraphQLResponse(null, false, "Atleast one field required", ["No fields passed"], new Error().stack);
        }

        if (name) {
            const nameValidation = await validateName(name);
            if (!nameValidation.success) return nameValidation;
        }
        
        if (email) {
            const emailValidation = await validateEmail(email);
            if (!emailValidation.success) return emailValidation;
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return new GraphQLResponse(null, false, "Email is already in use", ["Email is already taken"], new Error().stack);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                ...(name && { name }),
                ...(email && { email, emailVerified: false })
            },
            { new: true }
        ).select("-password -refreshToken");

        if (!updatedUser) {
            return new GraphQLResponse(null, false, "User not found", ["User not found"], new Error().stack);
        }

        return new GraphQLResponse(updatedUser, true, "User updated successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, error, error.stack);
    }
};


const updatePassword = async (_, args, context) => {
    const { currentPassword, newPassword } = args.input;
    try {
        if(currentPassword === newPassword) {
            return new GraphQLResponse(null, false, "Current and new passwords are same", ["Current and new passwords are same"], new Error().stack);
        }
        const currentPasswordValidation = await validatePassword(currentPassword);
        if (!currentPasswordValidation.success) return currentPasswordValidation;
        const newPasswordValidation = await validatePassword(newPassword);
        if (!newPasswordValidation.success) return newPasswordValidation;

        const jwtResponse = await verifyJWT(context);
        if(!jwtResponse.success) return jwtResponse;

        const user = jwtResponse.data;
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User not authenticated"], new Error().stack);
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return new GraphQLResponse(null, false, "Invalid password", ["Invalid password"], new Error().stack);
        }

        user.password = newPassword;
        const updatedUser = await user.save();
        if (!updatedUser) {
            return new GraphQLResponse(null, false, "Password update failed", ["Password not updated"], new Error().stack);
        }

        return new GraphQLResponse(null, true, "Password updated successfully");
    } catch(error) {
        return new GraphQLResponse(null, false, error.message, error, error.stack);
    }
}

module.exports = {
    updateProfile,
    updatePassword
};