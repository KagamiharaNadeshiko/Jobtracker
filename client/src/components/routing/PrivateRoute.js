import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loading, loadUser } = authContext;

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <div className = "loading" > Loading... < /div>;
    }

    return isAuthenticated ? children : < Navigate to = "/login" / > ;
};

export default PrivateRoute;