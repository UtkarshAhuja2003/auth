const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyJWT = require("../middlewares/auth");
const { GraphQLResponse } = require("../utils/GraphQLResponse");
const { validateUserInput, validateEmail, validatePassword } = require("../validators/userValidator");
const { sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent } = require("../utils/mail");

const registerUser = async (_, args, context) => {
    const { name, email, password } = args.input;

    try {
        const userValidation = await validateUserInput(args.input, "register");
        if (!userValidation.success) return userValidation;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new GraphQLResponse(null, false, "User already exists", ["User with this email already exists"], new Error().stack);
        }

        const user = await User.create({ email, password, name });
        const emailVerificationToken = user.generateVerificationToken();
        user.verificationToken = emailVerificationToken;
        await user.save();

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        if (!createdUser) {
            return new GraphQLResponse(null, false, "User registration unsuccessful", ["Failed to register user"], new Error().stack);
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };
        context.res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
        context.res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });

        await sendEmail({
            email: user.email,
            subject: "Email Verification",
            mailgenContent: emailVerificationMailgenContent(
                user.name,
                `${process.env.CLIENT_URL}/user/verify-email?token=${emailVerificationToken}`
            )
        });

        return new GraphQLResponse(createdUser, true, "User registered successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, [error.message], error.stack);
    }
};

const loginUser = async (_, args, context) => {
    const { email, password } = args.input;

    try {
        const userValidation = await validateUserInput(args.input, "login");
        if (!userValidation.success) return userValidation;

        const user = await User.findOne({ email });
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User with this email not found"], new Error().stack);
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return new GraphQLResponse(null, false, "Invalid credentials", ["Incorrect password"], new Error().stack);
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        if (!loggedInUser) {
            return new GraphQLResponse(null, false, "User login unsuccessful", ["Failed to log in user"], new Error().stack);
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };
        context.res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
        context.res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });
        
        return new GraphQLResponse(loggedInUser, true, "User logged in successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, [error.message], error.stack);
    }
};

const verifyEmail = async (_, args, context) => {
    const { emailVerificationToken } = args;
    try {
        const jwtResponse = await verifyJWT(context);
        if(!jwtResponse.success) return jwtResponse;

        const user = jwtResponse.data;
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User not authenticated"], new Error().stack);
        }

        if (emailVerificationToken !== user.verificationToken) {
            return new GraphQLResponse(null, false, "Email verification token is expired or used", ["Invalid or expired email verification token"], new Error().stack);
        }

        user.emailVerified = true;
        user.verificationToken = "";
        await user.save();

        return new GraphQLResponse(null, true, "Email verified successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, [error.message], error.stack);
    }
};

const resendVerificationEmail = async(_, __, context) => {
    try {
        const jwtResponse = await verifyJWT(context);
        if(!jwtResponse.success) return jwtResponse;

        const user = jwtResponse.data;
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User not authenticated"], new Error().stack);
        }

        if(user.emailVerified) {
            return new GraphQLResponse(null, false, "Email is already verified", ["Provided account is already verified"], new Error().stack);
        }

        const emailVerificationToken = user.generateVerificationToken();
        user.verificationToken = emailVerificationToken;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: "Email Verification",
            mailgenContent: emailVerificationMailgenContent(
                user.name,
                `${process.env.CLIENT_URL}/user/verify-email?token=${emailVerificationToken}`
            )
        });

        return new GraphQLResponse(null, true, "Verification mail sent");
    } catch(error) {
        return new GraphQLResponse(null, false, error.message, error, error.stack);
    }
};

const getCurrentUser = async (_, __, context) => {
    try {
        const jwtResponse = await verifyJWT(context);
        if(!jwtResponse.success) return jwtResponse;

        const user = jwtResponse.data;
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User not authenticated"], new Error().stack);
        }

        const { _id, name, email } = user;
        return new GraphQLResponse({ _id, name, email }, true, "User retrieved successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, [error.message], error.stack);
    }
};

const logoutUser = async (_, args, context) => {
    try {
        const jwtResponse = await verifyJWT(context);
        if(!jwtResponse.success) return jwtResponse;

        const user = jwtResponse.data;
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User not authenticated"], new Error().stack);
        }

        await User.findByIdAndUpdate(user._id, { refreshToken: "" });
        context.res.cookie("accessToken", "", { maxAge: 0 });
        context.res.cookie("refreshToken", "", { maxAge: 0 });

        return new GraphQLResponse(null, true, "User logged out successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, [error.message], error.stack);
    }
};

const forgotPasswordRequest = async (_, args, context) => {
    const { email } = args;
    try {
        const emailValidation = await validateEmail(email);
        if(!emailValidation.success) return emailValidation;

        const user = await User.findOne({ email });
        if (!user) {
            return new GraphQLResponse(null, false, "User not found", ["User with this email not found"], new Error().stack);
        }

        const forgotPasswordToken = user.generateForgotPasswordToken();
        user.forgotPasswordToken = forgotPasswordToken;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: "Password reset request",
            mailgenContent: forgotPasswordMailgenContent(
                user.name,
                `${process.env.CLIENT_URL}/user/forgot-password/reset?token=${forgotPasswordToken}`
            )
        });

        return new GraphQLResponse(null, true, "Reset Password mail sent successfully");
    } catch(error) {
        return new GraphQLResponse(null, false, error.message, error, error.stack);
    }
};

const resetForgottenPassword = async (_, args) => {
    const { forgotPasswordToken, newPassword } = args;
    try {
        const passwordValidation = await validatePassword(newPassword);
        if(!passwordValidation.success) return passwordValidation;

        const decodedToken = jwt.verify(forgotPasswordToken, process.env.FORGOT_PASSWORD_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);
        
        if (!user || user.forgotPasswordToken !== forgotPasswordToken) {
            return new GraphQLResponse(null, false, "Token is invalid or expired", ["User with this token not found"], new Error().stack);
        }

        user.forgotPasswordToken = undefined;
        user.password = newPassword;
        const updatedUser = await user.save();
        if (!updatedUser) {
            return new GraphQLResponse(null, false, "Password update failed", ["Password not updated"], new Error().stack);
        }
        
        return new GraphQLResponse(null, true, "Password updated successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, error, error.stack);
    }
}

const generateAccessAndRefreshToken = async (userId) => {
  try {
      const user = await User.findById(userId);

      if (!user) {
          throw new Error("User not found");
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save();

      return { accessToken, refreshToken };
  } catch (error) {
      throw new Error(error.message || "Failed to generate tokens");
  }
};

const refreshAccessToken = async (_, args, context) => {
  const { incomingRefreshToken } = args.input;
  if (!incomingRefreshToken) {
      return new GraphQLResponse(null, false, "Invalid refresh token", ["Refresh token is missing"], new Error().stack);
  }

  try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id);
 
      if (!user) {
          return new GraphQLResponse(null, false, "User not found", ["User with this token not found"], new Error().stack);
      }

      if (incomingRefreshToken !== user.refreshToken) {
          return new GraphQLResponse(null, false, "Refresh token is expired or used", ["Invalid or expired refresh token"], new Error().stack);
      }

      try {
          const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
          const cookieOptions = {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Strict",
          };
          context.res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 15 });
          context.res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });

          return new GraphQLResponse(null, true, "Tokens refreshed successfully");
      } catch (tokenError) {
          return new GraphQLResponse(null, false, "Token generation failed", [tokenError.message], tokenError.stack);
      }

  } catch (error) {
      return new GraphQLResponse(null, false, error.message, [error.message], error.stack);
  }
};

module.exports = {
    refreshAccessToken,
    registerUser,
    loginUser,
    verifyEmail,
    logoutUser,
    getCurrentUser,
    resendVerificationEmail,
    forgotPasswordRequest,
    resetForgottenPassword
};
