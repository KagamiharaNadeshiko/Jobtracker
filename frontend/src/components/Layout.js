import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { currentUser, logout } = useContext(AuthContext);

    return ( <
        div className = "min-h-screen bg-gray-50" > { /* Header */ } <
        header className = "bg-white shadow" >
        <
        div className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
        <
        div className = "flex justify-between h-16" >
        <
        div className = "flex" >
        <
        div className = "flex-shrink-0 flex items-center" >
        <
        Link to = "/"
        className = "text-xl font-bold text-indigo-600" >
        求职申请管理 <
        /Link> < /
        div > <
        /div> <
        div className = "flex items-center" >
        <
        span className = "px-3 text-sm text-gray-700" > { currentUser ? .email } <
        /span> <
        button onClick = { logout }
        className = "ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
        退出 <
        /button> < /
        div > <
        /div> < /
        div > <
        /header>

        { /* Main content */ } <
        main className = "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" >
        <
        Outlet / >
        <
        /main>

        { /* Footer */ } <
        footer className = "bg-white border-t border-gray-200 py-4" >
        <
        div className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
        <
        p className = "text-center text-sm text-gray-500" >
        &
        copy; { new Date().getFullYear() }
        求职申请管理系统 <
        /p> < /
        div > <
        /footer> < /
        div >
    );
};

export default Layout;