import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import IndustryDetail from './pages/IndustryDetail';
import CompanyDetail from './pages/CompanyDetail';
import PositionDetail from './pages/PositionDetail';
import InterviewList from './pages/InterviewList';
import NotFound from './pages/NotFound';

// Import components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return <div className = "flex items-center justify-center min-h-screen" > Loading... < /div>;
    }

    return ( <
        Routes >
        <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        />

        { /* Protected routes */ } <
        Route path = "/"
        element = { < ProtectedRoute > < Layout / > < /ProtectedRoute>}> <
            Route index element = { < Dashboard / > }
            /> <
            Route path = "industries/:id"
            element = { < IndustryDetail / > }
            /> <
            Route path = "companies/:id"
            element = { < CompanyDetail / > }
            /> <
            Route path = "positions/:id"
            element = { < PositionDetail / > }
            /> <
            Route path = "positions/:id/interviews"
            element = { < InterviewList / > }
            /> < /
            Route >

            <
            Route path = "*"
            element = { < NotFound / > }
            /> < /
            Routes >
        );
    }

    export default App;