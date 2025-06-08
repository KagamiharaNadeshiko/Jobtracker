import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import authReducer from './reducers/authReducer';
import setAuthToken from '../utils/setAuthToken';

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
};

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/users/me');

            dispatch({
                type: 'USER_LOADED',
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: 'AUTH_ERROR'
            });
        }
    };

    // Register User
    const register = async(formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/users', formData, config);

            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data
            });

            loadUser();
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach(error => console.error(error.msg));
            }

            dispatch({
                type: 'REGISTER_FAIL',
                payload: errors ? errors : [{ msg: 'Registration failed' }]
            });
        }
    };

    // Login User
    const login = async(email, password) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({ email, password });

        try {
            const res = await axios.post('/api/users/login', body, config);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            });

            loadUser();
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach(error => console.error(error.msg));
            }

            dispatch({
                type: 'LOGIN_FAIL',
                payload: errors ? errors : [{ msg: 'Login failed' }]
            });
        }
    };

    // Logout
    const logout = () => dispatch({ type: 'LOGOUT' });

    // Clear Errors
    const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

    return ( <
        AuthContext.Provider value = {
            {
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                loadUser,
                login,
                logout,
                clearErrors
            }
        } > { children } <
        /AuthContext.Provider>
    );
};

export default AuthContext;