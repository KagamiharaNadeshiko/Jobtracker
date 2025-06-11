import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in on page load
        const token = localStorage.getItem('token');
        if (token) {
            fetchCurrentUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async(token) => {
        try {
            const res = await axios.get('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCurrentUser(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            setLoading(false);
        }
    };

    const login = async(email, password) => {
        try {
            setError(null);
            const res = await axios.post('/api/auth/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setCurrentUser(user);
            return true;
        } catch (error) {
            setError(error.response ? .data ? .message || 'Login failed');
            return false;
        }
    };

    const register = async(email, password) => {
        try {
            setError(null);
            const res = await axios.post('/api/auth/register', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setCurrentUser(user);
            return true;
        } catch (error) {
            setError(error.response ? .data ? .message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        error,
        login,
        register,
        logout
    };

    return ( <
        AuthContext.Provider value = { value } > { children } <
        /AuthContext.Provider>
    );
};