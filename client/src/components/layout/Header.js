import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Header = () => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, logout, user } = authContext;

    const onLogout = () => {
        logout();
    };

    const authLinks = ( <
        >
        <
        li >
        <
        Link to = "/" > Dashboard < /Link> < /
        li > <
        li >
        <
        Link to = "/industries" > Industries < /Link> < /
        li > <
        li >
        <
        Link to = "/companies" > Companies < /Link> < /
        li > <
        li >
        <
        Link to = "/positions" > Positions < /Link> < /
        li > <
        li >
        <
        a onClick = { onLogout }
        href = "#!" >
        <
        span > Logout < /span> < /
        a > <
        /li> < / >
    );

    const guestLinks = ( <
        >
        <
        li >
        <
        Link to = "/register" > Register < /Link> < /
        li > <
        li >
        <
        Link to = "/login" > Login < /Link> < /
        li > <
        />
    );

    return ( <
        header className = "header" >
        <
        div className = "logo" >
        <
        h1 >
        <
        Link to = "/" > JobTracing < /Link> < /
        h1 > <
        /div> <
        nav >
        <
        ul > { isAuthenticated ? authLinks : guestLinks } <
        /ul> < /
        nav > <
        /header>
    );
};

export default Header;