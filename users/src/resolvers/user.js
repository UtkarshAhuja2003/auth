const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyJWT = require("../middlewares/auth");
const { GraphQLResponse } = require("../utils/GraphQLResponse");
const { validateUserInput } = require("../validators/userValidator");

const registerUser = async (_, args, context) => {
    const { name, email, password } = args.input;

    try {
        validateUserInput(args.input, "register");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new GraphQLResponse(null, false, "User already exists", ["User with this email already exists"], new Error().stack);
        }

        const user = await User.create({ email, password, name });
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

        return new GraphQLResponse(createdUser, true, "User registered successfully");
    } catch (error) {
        return new GraphQLResponse(null, false, error.message, [error.message], error.stack);
    }
};

const loginUser = async (_, args, context) => {
    const { email, password } = args.input;

    try {
        validateUserInput(args.input, "login");

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
    logoutUser,
    getCurrentUser
};
