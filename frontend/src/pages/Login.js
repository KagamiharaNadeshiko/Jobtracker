import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { currentUser, login, error } = useContext(AuthContext);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await login(email, password);
        setIsSubmitting(false);
    };

    if (currentUser) {
        return <Navigate to = "/" / > ;
    }

    return ( <
        div className = "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" >
        <
        div className = "max-w-md w-full space-y-8" >
        <
        div >
        <
        h2 className = "mt-6 text-center text-3xl font-extrabold text-gray-900" >
        登录您的账户 <
        /h2> < /
        div >

        {
            error && ( <
                div className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role = "alert" >
                <
                span className = "block sm:inline" > { error } < /span> < /
                div >
            )
        }

        <
        form className = "mt-8 space-y-6"
        onSubmit = { handleSubmit } >
        <
        div className = "rounded-md shadow-sm -space-y-px" >
        <
        div >
        <
        label htmlFor = "email-address"
        className = "sr-only" >
        电子邮箱 <
        /label> <
        input id = "email-address"
        name = "email"
        type = "email"
        autoComplete = "email"
        required value = { email }
        onChange = {
            (e) => setEmail(e.target.value)
        }
        className = "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder = "电子邮箱" /
        >
        <
        /div> <
        div >
        <
        label htmlFor = "password"
        className = "sr-only" >
        密码 <
        /label> <
        input id = "password"
        name = "password"
        type = "password"
        autoComplete = "current-password"
        required value = { password }
        onChange = {
            (e) => setPassword(e.target.value)
        }
        className = "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder = "密码" /
        >
        <
        /div> < /
        div >

        <
        div >
        <
        button type = "submit"
        disabled = { isSubmitting }
        className = "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" > { isSubmitting ? '登录中...' : '登录' } <
        /button> < /
        div >

        <
        div className = "text-sm text-center" >
        <
        Link to = "/register"
        className = "font-medium text-indigo-600 hover:text-indigo-500" >
        没有账户？ 注册 <
        /Link> < /
        div > <
        /form> < /
        div > <
        /div>
    );
};

export default Login;