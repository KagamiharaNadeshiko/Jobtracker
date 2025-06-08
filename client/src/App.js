import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Industries from './pages/Industries';
import Companies from './pages/Companies';
import Positions from './pages/Positions';
import PositionDetail from './pages/PositionDetail';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import './App.css';

const App = () => {
    return ( <
        AuthProvider >
        <
        AlertProvider >
        <
        Router >
        <
        div className = "app-container" >
        <
        Header / >
        <
        main className = "main-content" >
        <
        Routes >
        <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        /> <
        Route path = "/"
        element = { <
            PrivateRoute >
            <
            Dashboard / >
            <
            /PrivateRoute>
        }
        /> <
        Route path = "/industries"
        element = { <
            PrivateRoute >
            <
            Industries / >
            <
            /PrivateRoute>
        }
        /> <
        Route path = "/companies"
        element = { <
            PrivateRoute >
            <
            Companies / >
            <
            /PrivateRoute>
        }
        /> <
        Route path = "/positions"
        element = { <
            PrivateRoute >
            <
            Positions / >
            <
            /PrivateRoute>
        }
        /> <
        Route path = "/positions/:id"
        element = { <
            PrivateRoute >
            <
            PositionDetail / >
            <
            /PrivateRoute>
        }
        /> < /
        Routes > <
        /main> <
        Footer / >
        <
        /div> < /
        Router > <
        /AlertProvider> < /
        AuthProvider >
    );
};

export default App;