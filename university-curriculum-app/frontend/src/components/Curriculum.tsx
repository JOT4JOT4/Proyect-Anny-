import React, { useEffect, useState } from 'react';

const Curriculum: React.FC = () => {
    const [curriculumData, setCurriculumData] = useState([]);

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const response = await fetch('/api/curriculum');
                const data = await response.json();
                setCurriculumData(data);
            } catch (error) {
                console.error('Error fetching curriculum data:', error);
            }
        };

        fetchCurriculum();
    }, []);

    return (
        <div>
            <h1>University Curriculum</h1>
            <ul>
                {curriculumData.map((item) => (
                    <li key={item.id}>
                        {item.courseName} - {item.credits} credits
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Curriculum;