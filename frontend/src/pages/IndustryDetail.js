import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const IndustryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [industry, setIndustry] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyDescription, setNewCompanyDescription] = useState('');
    const [editIndustryName, setEditIndustryName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchIndustryDetails();
    }, [id]);

    const fetchIndustryDetails = async() => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/industries/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIndustry(res.data);
            setCompanies(res.data.companies || []);
            setEditIndustryName(res.data.name);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching industry details:', error);
            setError('获取行业详情失败');
            setLoading(false);
        }
    };

    const handleAddCompany = async(e) => {
        e.preventDefault();
        if (!newCompanyName.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/companies', {
                    industry_id: id,
                    name: newCompanyName,
                    description: newCompanyDescription
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setNewCompanyName('');
            setNewCompanyDescription('');
            setShowAddModal(false);
            fetchIndustryDetails();
        } catch (error) {
            console.error('Error adding company:', error);
            setError('添加公司失败');
        }
    };

    const handleEditIndustry = async(e) => {
        e.preventDefault();
        if (!editIndustryName.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/api/industries/${id}`, { name: editIndustryName }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setShowEditModal(false);
            fetchIndustryDetails();
        } catch (error) {
            console.error('Error updating industry:', error);
            setError('更新行业失败');
        }
    };

    const handleDeleteIndustry = async() => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/industries/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Error deleting industry:', error);
            setError('删除行业失败');
            setShowDeleteModal(false);
        }
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return ( <
            div className = "flex justify-center items-center h-64" >
            <
            div className = "text-gray-500" > 加载中... < /div> < /
            div >
        );
    }

    if (!industry) {
        return ( <
            div className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" >
            行业不存在或已被删除 <
            /div>
        );
    }

    return ( <
            div className = "container mx-auto px-4" >
            <
            div className = "mb-6" >
            <
            div className = "flex items-center mb-4" >
            <
            Link to = "/"
            className = "text-indigo-600 hover:text-indigo-900 mr-2" > ←返回行业列表 <
            /Link> < /
            div >

            <
            div className = "flex justify-between items-center" >
            <
            h1 className = "text-2xl font-bold text-gray-900" > { industry.name } < /h1> <
            div className = "flex space-x-2" >
            <
            button onClick = {
                () => setShowEditModal(true)
            }
            className = "px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500" >
            编辑行业 <
            /button> <
            button onClick = {
                () => setShowDeleteModal(true)
            }
            className = "px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
            删除行业 <
            /button> < /
            div > <
            /div> < /
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

            <
            div className = "bg-white shadow overflow-hidden sm:rounded-md" >
            <
            div className = "px-4 py-5 sm:px-6 flex justify-between items-center" >
            <
            div >
            <
            h3 className = "text-lg leading-6 font-medium text-gray-900" > 公司列表 < /h3> <
            p className = "mt-1 max-w-2xl text-sm text-gray-500" > 该行业下的所有公司 < /p> < /
            div > <
            button onClick = {
                () => setShowAddModal(true)
            }
            className = "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
            添加公司 <
            /button> < /
            div >

            <
            div className = "px-4 py-3 bg-gray-50" >
            <
            div className = "max-w-lg" >
            <
            input type = "text"
            placeholder = "搜索公司..."
            value = { searchTerm }
            onChange = {
                (e) => setSearchTerm(e.target.value)
            }
            className = "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" /
            >
            <
            /div> < /
            div >

            {
                filteredCompanies.length === 0 ? ( <
                    div className = "px-4 py-5 sm:px-6 text-center text-gray-500" > { searchTerm ? '没有找到匹配的公司' : '暂无公司数据，请点击"添加公司"按钮创建' } <
                    /div>
                ) : ( <
                        ul className = "divide-y divide-gray-200" > {
                            filteredCompanies.map((company) => ( <
                                    li key = { company.id } >
                                    <
                                    Link to = { `/companies/${company.id}` }
                                    className = "block hover:bg-gray-50" >
                                    <
                                    div className = "px-4 py-4 sm:px-6" >
                                    <
                                    div className = "flex items-center justify-between" >
                                    <
                                    p className = "text-sm font-medium text-indigo-600 truncate" > { company.name } <
                                    /p> <
                                    div className = "ml-2 flex-shrink-0 flex" >
                                    <
                                    p className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" >
                                    查看详情 <
                                    /p> < /
                                    div > <
                                    /div> {
                                    company.description && ( <
                                        div className = "mt-2 sm:flex sm:justify-between" >
                                        <
                                        div className = "sm:flex" >
                                        <
                                        p className = "flex items-center text-sm text-gray-500" > {
                                            company.description.length > 100 ?
                                            `${company.description.substring(0, 100)}...` : company.description
                                        } <
                                        /p> < /
                                        div > <
                                        /div>
                                    )
                                } <
                                /div> < /
                                Link > <
                                /li>
                            ))
                    } <
                    /ul>
            )
        } <
        /div>

    { /* Add Company Modal */ } {
        showAddModal && ( <
            div className = "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10" >
            <
            div className = "bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" >
            <
            form onSubmit = { handleAddCompany } >
            <
            div className = "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" >
            <
            div className = "sm:flex sm:items-start" >
            <
            div className = "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" >
            <
            h3 className = "text-lg leading-6 font-medium text-gray-900" > 添加公司 < /h3> <
            div className = "mt-2 space-y-4" >
            <
            input type = "text"
            value = { newCompanyName }
            onChange = {
                (e) => setNewCompanyName(e.target.value)
            }
            placeholder = "公司名称"
            className = "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required /
            >
            <
            textarea value = { newCompanyDescription }
            onChange = {
                (e) => setNewCompanyDescription(e.target.value)
            }
            placeholder = "公司描述（可选）"
            rows = "3"
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
    }

    { /* Edit Industry Modal */ } {
        showEditModal && ( <
            div className = "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10" >
            <
            div className = "bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" >
            <
            form onSubmit = { handleEditIndustry } >
            <
            div className = "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" >
            <
            div className = "sm:flex sm:items-start" >
            <
            div className = "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" >
            <
            h3 className = "text-lg leading-6 font-medium text-gray-900" > 编辑行业 < /h3> <
            div className = "mt-2" >
            <
            input type = "text"
            value = { editIndustryName }
            onChange = {
                (e) => setEditIndustryName(e.target.value)
            }
            placeholder = "行业名称"
            className = "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required /
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
                () => setShowEditModal(false)
            }
            className = "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
            取消 <
            /button> < /
            div > <
            /form> < /
            div > <
            /div>
        )
    }

    { /* Delete Industry Confirmation Modal */ } {
        showDeleteModal && ( <
            div className = "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10" >
            <
            div className = "bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" >
            <
            div className = "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" >
            <
            div className = "sm:flex sm:items-start" >
            <
            div className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10" >
            <
            svg className = "h-6 w-6 text-red-600"
            xmlns = "http://www.w3.org/2000/svg"
            fill = "none"
            viewBox = "0 0 24 24"
            stroke = "currentColor" >
            <
            path strokeLinecap = "round"
            strokeLinejoin = "round"
            strokeWidth = "2"
            d = "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" / >
            <
            /svg> < /
            div > <
            div className = "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left" >
            <
            h3 className = "text-lg leading-6 font-medium text-gray-900" > 删除行业 < /h3> <
            div className = "mt-2" >
            <
            p className = "text-sm text-gray-500" >
            确定要删除此行业吗？ 此操作将同时删除该行业下的所有公司和职位记录， 且不可恢复。 <
            /p> < /
            div > <
            /div> < /
            div > <
            /div> <
            div className = "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" >
            <
            button type = "button"
            onClick = { handleDeleteIndustry }
            className = "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" >
            删除 <
            /button> <
            button type = "button"
            onClick = {
                () => setShowDeleteModal(false)
            }
            className = "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
            取消 <
            /button> < /
            div > <
            /div> < /
            div >
        )
    } <
    /div>
);
};

export default IndustryDetail;