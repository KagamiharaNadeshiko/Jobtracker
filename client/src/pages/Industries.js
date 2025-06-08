import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Industries = () => {
    const [industries, setIndustries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIndustries = async() => {
            try {
                const res = await axios.get('/api/industries');
                setIndustries(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching industries:', err);
                setLoading(false);
            }
        };

        fetchIndustries();
    }, []);

    if (loading) {
        return <div className = "loading" > Loading... < /div>;
    }

    return ( <
        div className = "industries-page" >
        <
        h1 > Industries < /h1> <
        p > Manage your industry categories here. < /p>

        {
            industries.length === 0 ? ( <
                p > No industries found.Add your first industry! < /p>
            ) : ( <
                ul className = "list" > {
                    industries.map(industry => ( <
                        li key = { industry._id } >
                        <
                        div >
                        <
                        h3 > { industry.name } < /h3> <
                        p > { industry.description } < /p> < /
                        div > <
                        /li>
                    ))
                } <
                /ul>
            )
        } <
        /div>
    );
};

export default Industries;