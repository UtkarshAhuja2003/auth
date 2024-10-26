import { User } from "@/interfaces/user";
import Cookies from "js-cookie";
const USER_API_URL = process.env.USER_URI || 'http://localhost:8000/user';

const loginUser = async (user: User): Promise<{ success: boolean; message?: string }> => {
    try {
        const variables = {
            "input": {
                "email": user.email,
                "password": user.password,
            }
        }

        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation LoginUser($input: LoginInput!) {
                        loginUser(input: $input) {
                            success
                            message
                            data {
                                _id
                            }
                        }
                    }
                `,
                variables,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to login user",
            };
        }

        const jsonResponse = await response.json();
        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.loginUser) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.loginUser.success) {
            return {
                success: false,
                message: jsonResponse.data.loginUser.message || "Failed to login user",
            };
        }

        return {
            success: true,
            message: "User logged in successfully",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const registerUser = async (user: User): Promise<{ success: boolean; message?: string }> => {
    try {
        const variables = {
            "input": {
                "email": user.email,
                "password": user.password,
                "name": user.name,
            }
        }

        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation RegisterUser($input: RegisterInput!) {
                        registerUser(input: $input) {
                            success
                            message
                            data {
                                _id
                            }
                        }
                    }
                `,
                variables,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to register user",
            };
        }

        const jsonResponse = await response.json();
        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.registerUser) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.registerUser.success) {
            return {
                success: false,
                message: jsonResponse.data.registerUser.message || "Failed to register user",
            };
        }

        return {
            success: true,
            message: "User Registered successfully",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const forgotPasswordRequest = async ({ email }: { email: string }): Promise<{ success: boolean, message: string }> => {
    const variables = {
        "email": email
    }
    try {
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation ForgotPasswordRequest($email: String!) {
                        forgotPasswordRequest(email: $email) {
                            success
                            message
                            errors
                            stack
                        }
                    }
                `,
                variables,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to request password reset",
            };
        }

        const jsonResponse = await response.json();
        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.forgotPasswordRequest) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.forgotPasswordRequest.success) {
            return {
                success: false,
                message: jsonResponse.data.forgotPasswordRequest.message || "Failed to request password reset",
            };
        }

        return {
            success: true,
            message: "Password reset link has been sent to your email",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const resetForgottenPassword = async ({ newPassword, forgotPasswordToken }: { newPassword: string, forgotPasswordToken: string }): Promise<{ success: boolean, message: string }> => {
    const variables = {
        "forgotPasswordToken": forgotPasswordToken,
        "newPassword": newPassword
      }
    try {
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation ResetForgottenPassword($forgotPasswordToken: String!, $newPassword: String!) {
                        resetForgottenPassword(forgotPasswordToken: $forgotPasswordToken, newPassword: $newPassword) {
                            success
                            message
                            errors
                            stack
                        }
                    }
                `,
                variables,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to reset password",
            };
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.resetForgottenPassword) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.resetForgottenPassword.success) {
            return {
                success: false,
                message: jsonResponse.data.resetForgottenPassword.message || "Failed to reset password",
            };
        }

        return {
            success: true,
            message: "Password update successful!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const logoutUser = async (): Promise<{ success: boolean, message: string }> => {
    try {
        const accessToken = await getAccessToken();
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation LogoutUser {
                        logoutUser {
                            success
                            message
                            errors
                            stack
                        }
                    }
                `
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to logout User",
            };
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.logoutUser) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.logoutUser.success) {
            return {
                success: false,
                message: jsonResponse.data.logoutUser.message || "Failed to logout User",
            };
        }

        return {
            success: true,
            message: "Log out successful!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const verifyEmail = async (emailVerificationToken: string): Promise<{ success: boolean, message: string }> => {
    try {
        const accessToken = await getAccessToken();
        const variables = {
            "emailVerificationToken": emailVerificationToken
        }
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation VerifyEmail($emailVerificationToken: String!) {
                        verifyEmail(emailVerificationToken: $emailVerificationToken) {
                            success
                            message
                            errors
                            stack
                        }
                    }
                `,
                variables
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to verify email",
            };
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.verifyEmail) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.verifyEmail.success) {
            return {
                success: false,
                message: jsonResponse.data.verifyEmail.message || "Failed to verify email",
            };
        }

        return {
            success: true,
            message: "Email verified successfully!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const resendVerificationEmail = async (): Promise<{ success: boolean, message: string }> => {
    try {
        const accessToken = await getAccessToken();
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation ResendVerificationEmail {
                        resendVerificationEmail {
                            success
                            message
                            errors
                            stack
                        }
                    }
                `
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to resend verification email",
            };
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.resendVerificationEmail) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.resendVerificationEmail.success) {
            return {
                success: false,
                message: jsonResponse.data.resendVerificationEmail.message || "Failed to resend verification email",
            };
        }

        return {
            success: true,
            message: "Verification email sent successfully!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const getAccessToken = async (): Promise<string> => {
    let accessToken = Cookies.get('accessToken');
    if(!accessToken) {
      try {
        const refreshToken = Cookies.get('refreshToken');
        if(!refreshToken) {
          window.location.href = "/user/login";
        }
        const variables = {
            "input": {
              "incomingRefreshToken": refreshToken
            }
        }
  
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation RefreshAccessToken($input: RefreshTokenInput!) {
                        refreshAccessToken(input: $input) {
                            success
                            message
                            errors
                            stack
                        }
                    }
                `,
                variables
            }),
        });
  
        if (!response.ok) {
            throw new Error("Failed to refresh tokens");
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.refreshAccessToken || !jsonResponse.data.refreshAccessToken.success) {
            throw new Error("Failed to refresh tokens");
        }
      } catch (error) {
        if(error instanceof Error) {
            console.error(error.message || 'Something went wrong');
        } else {
            console.error("Unexpected Error", error);
        }
      }
    }
    accessToken = Cookies.get('accessToken');
    return accessToken || '';
};

const getCurrentUser = async (): Promise<{ user: User, success: boolean, message: string }> => {
    try {
        const accessToken = await getAccessToken();
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    query GetCurrentUser {
                        getCurrentUser {
                            success
                            message
                            errors
                            stack
                            data {
                                _id
                                email
                                name
                                emailVerified
                            }
                        }
                    }
                `
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                user: {},
                success: false,
                message: errorData.message || "Failed to get User",
            };
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.getCurrentUser) {
            return {
                user: {},
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.getCurrentUser.success) {
            return {
                user: {},
                success: false,
                message: jsonResponse.data.getCurrentUser.message || "Failed to get User",
            };
        }

        const user = jsonResponse.data.getCurrentUser.data;
        return {
            user,
            success: true,
            message: "User data fetch successful!",
        };
    } catch (error: unknown) {
        return {
            user: {},
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const updatePassword = async ({ currentPassword, newPassword }: {currentPassword: string, newPassword: string}): Promise<{ success: boolean, message: string }> => {
    try {
        const variables = {
            "input": {
              "currentPassword": currentPassword,
              "newPassword": newPassword
            }
        }
        const accessToken = await getAccessToken();
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation UpdatePassword($input: PasswordInput!) {
                        updatePassword(input: $input) {
                            success
                            message
                            errors
                            stack
                        }
                    }
                `,
                variables
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to update Password",
            };
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.updatePassword) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.updatePassword.success) {
            return {
                success: false,
                message: jsonResponse.data.updatePassword.message || "Failed to update Password",
            };
        }

        return {
            success: true,
            message: "Password update successful!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

const updateProfile = async (user: User): Promise<{ success: boolean, message: string }> => {
    try {
        const variables = {
            "input": {
              "email": user.email,
              "name": user.name
            }
          }
        const accessToken = await getAccessToken();
        const response = await fetch(USER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation UpdateProfile($input: ProfileInput!) {
                        updateProfile(input: $input) {
                            success
                            message
                            errors
                            stack
                            data {
                                _id
                                email
                                name
                                emailVerified
                            }
                        }
                    }
                `,
                variables
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Failed to update profile",
            };
        }

        const jsonResponse = await response.json();

        if (!jsonResponse || !jsonResponse.data || !jsonResponse.data.updateProfile) {
            return {
                success: false,
                message: "Unexpected response structure from user service",
            };
        }

        if (!jsonResponse.data.updateProfile.success) {
            return {
                success: false,
                message: jsonResponse.data.updateProfile.message || "Failed to update profile",
            };
        }

        return {
            success: true,
            message: "Profile update successful!",
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
        };
    }
};

export {
    loginUser,
    registerUser,
    forgotPasswordRequest,
    resetForgottenPassword,
    logoutUser,
    getAccessToken,
    resendVerificationEmail,
    verifyEmail,
    getCurrentUser,
    updatePassword,
    updateProfile
};
