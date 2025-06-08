import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async() => {
            try {
                const res = await axios.get('/api/companies');
                setCompanies(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return <div className = "loading" > Loading... < /div>;
    }

    return ( <
        div className = "companies-page" >
        <
        h1 > Companies < /h1> <
        p > Manage your companies here. < /p>

        {
            companies.length === 0 ? ( <
                p > No companies found.Add your first company! < /p>
            ) : ( <
                ul className = "list" > {
                    companies.map(company => ( <
                        li key = { company._id } >
                        <
                        div >
                        <
                        h3 > { company.name } < /h3> <
                        p > Industry: { company.industry.name } < /p> {
                        company.location && < p > Location: { company.location } < /p>} {
                        company.website && < p > Website: { company.website } < /p>} < /
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

export default Companies;