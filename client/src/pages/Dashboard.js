import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
        const authContext = useContext(AuthContext);
        const { user } = authContext;

        const [stats, setStats] = useState({
            counts: {
                industries: 0,
                companies: 0,
                positions: 0,
                interviews: 0
            },
            statusCounts: {},
            recentPositions: [],
            upcomingInterviews: []
        });

        useEffect(() => {
            const fetchDashboardData = async() => {
                try {
                    // In a real implementation, this would call the App Services function
                    // For prototype, we'll simulate with API calls to our Express backend
                    const industriesRes = await axios.get('/api/industries');
                    const companiesRes = await axios.get('/api/companies');
                    const positionsRes = await axios.get('/api/positions');

                    // Calculate status counts
                    const statusCounts = {};
                    positionsRes.data.forEach(position => {
                        statusCounts[position.status] = (statusCounts[position.status] || 0) + 1;
                    });

                    // Get recent positions (last 5)
                    const recentPositions = positionsRes.data
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5);

                    // For interviews, we'd need to implement this endpoint
                    // For prototype, we'll use an empty array
                    const upcomingInterviews = [];

                    setStats({
                        counts: {
                            industries: industriesRes.data.length,
                            companies: companiesRes.data.length,
                            positions: positionsRes.data.length,
                            interviews: 0 // Would come from interviews endpoint
                        },
                        statusCounts,
                        recentPositions,
                        upcomingInterviews
                    });
                } catch (err) {
                    console.error('Error fetching dashboard data:', err);
                }
            };

            fetchDashboardData();
        }, []);

        return ( <
                div className = "dashboard" >
                <
                h1 > Dashboard < /h1> <
                p > Welcome { user && user.username } < /p>

                <
                div className = "stats-grid" >
                <
                div className = "stat-card" >
                <
                h3 > Industries < /h3> <
                p className = "stat-number" > { stats.counts.industries } < /p> <
                Link to = "/industries" > View All < /Link> < /
                div > <
                div className = "stat-card" >
                <
                h3 > Companies < /h3> <
                p className = "stat-number" > { stats.counts.companies } < /p> <
                Link to = "/companies" > View All < /Link> < /
                div > <
                div className = "stat-card" >
                <
                h3 > Positions < /h3> <
                p className = "stat-number" > { stats.counts.positions } < /p> <
                Link to = "/positions" > View All < /Link> < /
                div > <
                div className = "stat-card" >
                <
                h3 > Interviews < /h3> <
                p className = "stat-number" > { stats.counts.interviews } < /p> <
                Link to = "/interviews" > View All < /Link> < /
                div > <
                /div>

                <
                div className = "dashboard-sections" >
                <
                div className = "section" >
                <
                h2 > Recent Positions < /h2> {
                stats.recentPositions.length > 0 ? ( <
                    ul className = "list" > {
                        stats.recentPositions.map(position => ( <
                            li key = { position._id } >
                            <
                            Link to = { `/positions/${position._id}` } > { position.title } - { position.company.name } <
                            /Link> <
                            span className = { `status status-${position.status.toLowerCase()}` } > { position.status } <
                            /span> < /
                            li >
                        ))
                    } <
                    /ul>
                ) : ( <
                    p > No positions added yet. < /p>
                )
            } <
            /div>

        <
        div className = "section" >
            <
            h2 > Upcoming Interviews < /h2> {
        stats.upcomingInterviews.length > 0 ? ( <
            ul className = "list" > {
                stats.upcomingInterviews.map(interview => ( <
                    li key = { interview._id } >
                    <
                    Link to = { `/positions/${interview.position._id}` } > { interview.position.title } - { interview.position.company.name } <
                    /Link> <
                    span > { new Date(interview.date).toLocaleDateString() } - { interview.type } <
                    /span> < /
                    li >
                ))
            } <
            /ul>
        ) : ( <
            p > No upcoming interviews. < /p>
        )
    } <
    /div> < /
div > <
    /div>
);
};

export default Dashboard;