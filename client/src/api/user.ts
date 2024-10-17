import { User } from "@/interfaces/user";
const USER_API_URL = process.env.USER_URI || 'http://localhost:8000/user';
import Cookies from 'js-cookie';

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
            },
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

        if(!response.ok) {
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

        if(!jsonResponse.data.loginUser.success) {
            return {
                success: false,
                message: jsonResponse.data.loginUser.message || "Failed to login user",
            };
        }

        return {
            success: true,
            message: "User logged in successfully",
        };
    } catch (error: any) {
        throw new Error(`Error logging user: ${error.message}`);
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
            },
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

        if(!response.ok) {
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

        if(!jsonResponse.data.registerUser.success) {
            return {
                success: false,
                message: jsonResponse.data.registerUser.message || "Failed to register user",
            };
        }

        return {
            success: true,
            message: "User Registered successfully",
        };
    } catch (error: any) {
        throw new Error(`Error registering user: ${error.message}`);
    }
};

export {
  loginUser,
  registerUser,
};
