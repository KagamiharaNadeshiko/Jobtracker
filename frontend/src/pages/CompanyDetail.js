import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form states
    const [newPositionTitle, setNewPositionTitle] = useState('');
    const [newPositionAppliedDate, setNewPositionAppliedDate] = useState('');
    const [newPositionEsText, setNewPositionEsText] = useState('');
    const [newPositionTestDeadline, setNewPositionTestDeadline] = useState('');
    const [newPositionTestType, setNewPositionTestType] = useState('');
    const [newPositionTestProgress, setNewPositionTestProgress] = useState('');

    const [editCompanyName, setEditCompanyName] = useState('');
    const [editCompanyDescription, setEditCompanyDescription] = useState('');

    useEffect(() => {
        fetchCompanyDetails();
    }, [id]);

    const fetchCompanyDetails = async() => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/companies/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCompany(res.data);
            setPositions(res.data.positions || []);
            setEditCompanyName(res.data.name);
            setEditCompanyDescription(res.data.description || '');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching company details:', error);
            setError('获取公司详情失败');
            setLoading(false);
        }
    };

    const handleAddPosition = async(e) => {
        e.preventDefault();
        if (!newPositionTitle.trim()) return;

        // Convert ES text to array
        const esArray = newPositionEsText
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.trim());

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/positions', {
                    company_id: id,
                    title: newPositionTitle,
                    applied_date: newPositionAppliedDate || null,
                    es_text: esArray,
                    test_deadline: newPositionTestDeadline || null,
                    test_type: newPositionTestType || null,
                    test_progress: newPositionTestProgress || null
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Reset form
            setNewPositionTitle('');
            setNewPositionAppliedDate('');
            setNewPositionEsText('');
            setNewPositionTestDeadline('');
            setNewPositionTestType('');
            setNewPositionTestProgress('');
            setShowAddModal(false);

            fetchCompanyDetails();
        } catch (error) {
            console.error('Error adding position:', error);
            setError('添加职位失败');
        }
    };

    const handleEditCompany = async(e) => {
        e.preventDefault();
        if (!editCompanyName.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/api/companies/${id}`, {
                    name: editCompanyName,
                    description: editCompanyDescription
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setShowEditModal(false);
            fetchCompanyDetails();
        } catch (error) {
            console.error('Error updating company:', error);
            setError('更新公司信息失败');
        }
    };

    const handleDeleteCompany = async() => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/companies/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Navigate back to the industry page
            if (company && company.industry) {
                navigate(`/industries/${company.industry.id}`);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            setError('删除公司失败');
            setShowDeleteModal(false);
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

    if (!company) {
        return ( <
            div className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" >
            公司不存在或已被删除 <
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
        Link to = { `/industries/${company.industry.id}` }
        className = "text-indigo-600 hover:text-indigo-900 mr-2" > ←返回行业页面 <
        /Link> < /
        div >

        <
        div className = "flex justify-between items-center" >
        <
        h1 className = "text-2xl font-bold text-gray-900" > { company.name } < /h1> <
        div className = "flex space-x-2" >
        <
        button onClick = {
            () => setShowEditModal(true)
        }
        className = "px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500" >
        编辑公司 <
        /button> <
        button onClick = {
            () => setShowDeleteModal(true)
        }
        className = "px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
        删除公司 <
        /button> < /
        div > <
        /div>

        {
            company.description && ( <
                p className = "mt-2 text-gray-600" > { company.description } < /p>
            )
        } <
        /div>

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
        h3 className = "text-lg leading-6 font-medium text-gray-900" > 职位列表 < /h3> <
        p className = "mt-1 max-w-2xl text-sm text-gray-500" > 该公司下的所有职位申请 < /p> < /
        div > <
        button onClick = {
            () => setShowAddModal(true)
        }
        className = "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
        添加职位 <
        /button> < /
        div >

        {
            positions.length === 0 ? ( <
                div className = "px-4 py-5 sm:px-6 text-center text-gray-500" >
                暂无职位数据， 请点击 "添加职位"
                按钮创建 <
                /div>
            ) : ( <
                ul className = "divide-y divide-gray-200" > {
                    positions.map((position) => ( <
                        li key = { position.id } >
                        <
                        Link to = { `/positions/${position.id}` }
                        className = "block hover:bg-gray-50" >
                        <
                        div className = "px-4 py-4 sm:px-6" >
                        <
                        div className = "flex items-center justify-between" >
                        <
                        p className = "text-sm font-medium text-indigo-600 truncate" > { position.title } <
                        /p> <
                        div className = "ml-2 flex-shrink-0 flex" >
                        <
                        p className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" >
                        查看详情 <
                        /p> < /
                        div > <
                        /div> <
                        div className = "mt-2 sm:flex sm:justify-between" >
                        <
                        div className = "sm:flex" >
                        <
                        p className = "flex items-center text-sm text-gray-500" > { position.applied_date ? `申请日期: ${position.applied_date}` : '未设置申请日期' } <
                        /p> < /
                        div > <
                        div className = "mt-2 flex items-center text-sm text-gray-500 sm:mt-0" > {
                            position.test_progress ? ( <
                                span className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800" > { position.test_progress } <
                                /span>
                            ) : ( <
                                span className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800" >
                                未设置状态 <
                                /span>
                            )
                        } <
                        /div> < /
                        div > <
                        /div> < /
                        Link > <
                        /li>
                    ))
                } <
                /ul>
            )
        } <
        /div>

        { /* Add Position Modal */ } {
            showAddModal && ( <
                div className = "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10" >
                <
                div className = "bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" >
                <
                form onSubmit = { handleAddPosition } >
                <
                div className = "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" >
                <
                div className = "sm:flex sm:items-start" >
                <
                div className = "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" >
                <
                h3 className = "text-lg leading-6 font-medium text-gray-900" > 添加职位 < /h3> <
                div className = "mt-2 space-y-4" >
                <
                div >
                <
                label htmlFor = "title"
                className = "block text-sm font-medium text-gray-700" >
                职位名称 *
                <
                /label> <
                input type = "text"
                id = "title"
                value = { newPositionTitle }
                onChange = {
                    (e) => setNewPositionTitle(e.target.value)
                }
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required /
                >
                <
                /div>

                <
                div >
                <
                label htmlFor = "applied-date"
                className = "block text-sm font-medium text-gray-700" >
                申请日期 <
                /label> <
                input type = "date"
                id = "applied-date"
                value = { newPositionAppliedDate }
                onChange = {
                    (e) => setNewPositionAppliedDate(e.target.value)
                }
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" /
                >
                <
                /div>

                <
                div >
                <
                label htmlFor = "es-text"
                className = "block text-sm font-medium text-gray-700" >
                ES 题目（ 每行一个问题） <
                /label> <
                textarea id = "es-text"
                value = { newPositionEsText }
                onChange = {
                    (e) => setNewPositionEsText(e.target.value)
                }
                rows = "3"
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder = "例如：
                1. 请描述你的项目经验 2. 你为什么选择我们公司 " / >
                <
                /div>

                <
                div className = "grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2" >
                <
                div >
                <
                label htmlFor = "test-deadline"
                className = "block text-sm font-medium text-gray-700" >
                网测截止日期 <
                /label> <
                input type = "date"
                id = "test-deadline"
                value = { newPositionTestDeadline }
                onChange = {
                    (e) => setNewPositionTestDeadline(e.target.value)
                }
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" /
                >
                <
                /div>

                <
                div >
                <
                label htmlFor = "test-type"
                className = "block text-sm font-medium text-gray-700" >
                网测类型 <
                /label> <
                input type = "text"
                id = "test-type"
                value = { newPositionTestType }
                onChange = {
                    (e) => setNewPositionTestType(e.target.value)
                }
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder = "例如：性格测试、编程题" /
                >
                <
                /div> < /
                div >

                <
                div >
                <
                label htmlFor = "test-progress"
                className = "block text-sm font-medium text-gray-700" >
                网测进度 <
                /label> <
                input type = "text"
                id = "test-progress"
                value = { newPositionTestProgress }
                onChange = {
                    (e) => setNewPositionTestProgress(e.target.value)
                }
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder = "例如：未开始、进行中、已完成" /
                >
                <
                /div> < /
                div > <
                /div> < /
                div > <
                /div> <
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

        { /* Edit Company Modal */ } {
            showEditModal && ( <
                div className = "fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10" >
                <
                div className = "bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" >
                <
                form onSubmit = { handleEditCompany } >
                <
                div className = "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" >
                <
                div className = "sm:flex sm:items-start" >
                <
                div className = "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" >
                <
                h3 className = "text-lg leading-6 font-medium text-gray-900" > 编辑公司 < /h3> <
                div className = "mt-2 space-y-4" >
                <
                div >
                <
                label htmlFor = "company-name"
                className = "block text-sm font-medium text-gray-700" >
                公司名称 <
                /label> <
                input type = "text"
                id = "company-name"
                value = { editCompanyName }
                onChange = {
                    (e) => setEditCompanyName(e.target.value)
                }
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required /
                >
                <
                /div>

                <
                div >
                <
                label htmlFor = "company-description"
                className = "block text-sm font-medium text-gray-700" >
                公司描述 <
                /label> <
                textarea id = "company-description"
                value = { editCompanyDescription }
                onChange = {
                    (e) => setEditCompanyDescription(e.target.value)
                }
                rows = "3"
                className = "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" /
                >
                <
                /div> < /
                div > <
                /div> < /
                div > <
                /div> <
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

        { /* Delete Company Confirmation Modal */ } {
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
                h3 className = "text-lg leading-6 font-medium text-gray-900" > 删除公司 < /h3> <
                div className = "mt-2" >
                <
                p className = "text-sm text-gray-500" >
                确定要删除此公司吗？ 此操作将同时删除该公司下的所有职位记录和面试记录， 且不可恢复。 <
                /p> < /
                div > <
                /div> < /
                div > <
                /div> <
                div className = "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" >
                <
                button type = "button"
                onClick = { handleDeleteCompany }
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

export default CompanyDetail;