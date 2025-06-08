import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PositionDetail = () => {
        const { id } = useParams();
        const [position, setPosition] = useState(null);
        const [essays, setEssays] = useState([]);
        const [onlineTests, setOnlineTests] = useState([]);
        const [interviews, setInterviews] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchPositionData = async() => {
                try {
                    // Fetch position details
                    const positionRes = await axios.get(`/api/positions/${id}`);
                    setPosition(positionRes.data);

                    // Fetch essays
                    const essaysRes = await axios.get(`/api/essays/position/${id}`);
                    setEssays(essaysRes.data);

                    // Fetch online tests
                    const testsRes = await axios.get(`/api/online-tests/position/${id}`);
                    setOnlineTests(testsRes.data);

                    // Fetch interviews
                    const interviewsRes = await axios.get(`/api/interviews/position/${id}`);
                    setInterviews(interviewsRes.data);

                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching position data:', err);
                    setLoading(false);
                }
            };

            fetchPositionData();
        }, [id]);

        if (loading) {
            return <div className = "loading" > Loading... < /div>;
        }

        if (!position) {
            return <div > Position not found < /div>;
        }

        return ( <
                div className = "position-detail" >
                <
                h1 > { position.title } < /h1> <
                div className = "position-meta" >
                <
                p > Company: { position.company.name } < /p> <
                p > Status: < span className = { `status status-${position.status.toLowerCase()}` } > { position.status } < /span></p > {
                    position.deadline && ( <
                        p > Deadline: { new Date(position.deadline).toLocaleDateString() } < /p>
                    )
                } {
                    position.description && ( <
                        div className = "description" >
                        <
                        h3 > Description < /h3> <
                        p > { position.description } < /p> < /
                        div >
                    )
                } <
                /div>

                <
                div className = "position-sections" >
                <
                div className = "section" >
                <
                h2 > Essays < /h2> {
                essays.length > 0 ? ( <
                    ul className = "list" > {
                        essays.map(essay => ( <
                            li key = { essay._id } >
                            <
                            h3 > { essay.question } < /h3> {
                            essay.answer && < p > { essay.answer } < /p>} < /
                            li >
                        ))
                    } <
                    /ul>
                ) : ( <
                    p > No essays added yet. < /p>
                )
            } <
            /div>

        <
        div className = "section" >
            <
            h2 > Online Tests < /h2> {
        onlineTests.length > 0 ? ( <
            ul className = "list" > {
                onlineTests.map(test => ( <
                    li key = { test._id } >
                    <
                    h3 > { test.type }
                    Test < /h3> {
                    test.description && < p > { test.description } < /p>} <
                    p > Status: { test.completed ? 'Completed' : 'Not completed' } < /p> < /
                    li >
                ))
            } <
            /ul>
        ) : ( <
            p > No online tests added yet. < /p>
        )
    } <
    /div>

<
div className = "section" >
    <
    h2 > Interviews < /h2> {
interviews.length > 0 ? ( <
    ul className = "list" > {
        interviews.map(interview => ( <
            li key = { interview._id } >
            <
            h3 > Round { interview.round }: { interview.type }
            Interview < /h3> {
            interview.date && ( <
                p > Date: { new Date(interview.date).toLocaleDateString() } < /p>
            )
        } {
            interview.location && < p > Location: { interview.location } < /p>} <
            p > Result: { interview.result } < /p> < /
            li >
        ))
    } <
    /ul>
) : ( <
    p > No interviews added yet. < /p>
)
} <
/div> < /
div > <
    /div>
);
};

export default PositionDetail;