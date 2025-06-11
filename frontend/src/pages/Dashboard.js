import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [industries, setIndustries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newIndustryName, setNewIndustryName] = useState('');

    useEffect(() => {
        fetchIndustries();
    }, []);

    const fetchIndustries = async() => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/industries', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIndustries(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching industries:', error);
            setError('获取行业数据失败');
            setLoading(false);
        }
    };

    const handleAddIndustry = async(e) => {
        e.preventDefault();
        if (!newIndustryName.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/industries', { name: newIndustryName }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setNewIndustryName('');
            setShowAddModal(false);
            fetchIndustries();
        } catch (error) {
            console.error('Error adding industry:', error);
            setError('添加行业失败');
        }
    };

    if (loading) {
        return ( <
            div className = "flex justify-center items-center h-64" >
            <
            div className = "text-gray-500" > 加载中... < /div> < /
            div >
        );
    }

    return ( <
        div className = "container mx-auto px-4" >
        <
        div className = "flex justify-between items-center mb-6" >
        <
        h1 className = "text-2xl font-bold text-gray-900" > 行业列表 < /h1> <
        button onClick = {
            () => setShowAddModal(true)
        }
        className = "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
        添加行业 <
        /button> < /
        div >

        {
            error && ( <
                div className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role = "alert" >
                <
                span className = "block sm:inline" > { error } < /span> < /
                div >
            )
        }

        {
            industries.length === 0 ? ( <
                div className = "bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500" >
                暂无行业数据， 请点击 "添加行业"
                按钮创建 <
                /div>
            ) : ( <
                div className = "bg-white shadow overflow-hidden sm:rounded-md" >
                <
                ul className = "divide-y divide-gray-200" > {
                    industries.map((industry) => ( <
                        li key = { industry.id } >
                        <
                        Link to = { `/industries/${industry.id}` }
                        className = "block hover:bg-gray-50" >
                        <
                        div className = "px-4 py-4 sm:px-6" >
                        <
                        div className = "flex items-center justify-between" >
                        <
                        p className = "text-sm font-medium text-indigo-600 truncate" > { industry.name } <
                        /p> <
                        div className = "ml-2 flex-shrink-0 flex" >
                        <
                        p className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" >
                        查看详情 <
                        /p> < /
                        div > <
                        /div> < /
                        div > <
                        /Link> < /
                        li >
                    ))
                } <
                /ul> < /
                div >
            )
        }

        { /* Add Industry Modal */ } {
            showAddModal && ( <
                div className = "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10" >
                <
                div className = "bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" >
                <
                form onSubmit = { handleAddIndustry } >
                <
                div className = "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" >
                <
                div className = "sm:flex sm:items-start" >
                <
                div className = "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" >
                <
                h3 className = "text-lg leading-6 font-medium text-gray-900" > 添加行业 < /h3> <
                div className = "mt-2" >
                <
                input type = "text"
                value = { newIndustryName }
                onChange = {
                    (e) => setNewIndustryName(e.target.value)
                }
                placeholder = "行业名称"
                className = "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" /
                >
                <
                /div> < /
                div > <
                /div> < /
                div > <
                div className = "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" >
                <
                button type = "submit"
                className = "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" >
                保存 <
                /button> <
                button type = "button"
                onClick = {
                    () => setShowAddModal(false)
                }
                className = "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                取消 <
                /button> < /
                div > <
                /form> < /
                div > <
                /div>
            )
        } <
        /div>
    );
};

export default Dashboard;