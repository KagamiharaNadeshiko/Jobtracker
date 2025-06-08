import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Positions = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPositions = async() => {
            try {
                const res = await axios.get('/api/positions');
                setPositions(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching positions:', err);
                setLoading(false);
            }
        };

        fetchPositions();
    }, []);

    if (loading) {
        return <div className = "loading" > Loading... < /div>;
    }

    return ( <
        div className = "positions-page" >
        <
        h1 > Positions < /h1> <
        p > Manage your job positions here. < /p>

        {
            positions.length === 0 ? ( <
                p > No positions found.Add your first position! < /p>
            ) : ( <
                ul className = "list" > {
                    positions.map(position => ( <
                        li key = { position._id } >
                        <
                        div >
                        <
                        Link to = { `/positions/${position._id}` } >
                        <
                        h3 > { position.title } < /h3> < /
                        Link > <
                        p > Company: { position.company.name } < /p> <
                        p > Status: < span className = { `status status-${position.status.toLowerCase()}` } > { position.status } < /span></p > {
                            position.deadline && ( <
                                p > Deadline: { new Date(position.deadline).toLocaleDateString() } < /p>
                            )
                        } <
                        /div> < /
                        li >
                    ))
                } <
                /ul>
            )
        } <
        /div>
    );
};

export default Positions;