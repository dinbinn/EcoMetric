import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';  
import './LandingPage.css';
import { UserContext } from "../context/userContext";

const LandingPage = () => {
    const { user } = useContext(UserContext);  
    const navigate = useNavigate();  

    const isLoggedIn = !!sessionStorage.getItem('accessToken');

    const handleButtonClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard/EcoData');  
        } else {
            navigate('/login');  
        }
    };

    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1>Welcome to EcoMetrics</h1>
                <p>Your one-stop solution for comprehensive data insights on carbon emissions and sustainability.</p>
                {}
                <button className="get-started-btn" onClick={handleButtonClick}>
                    {isLoggedIn ? "Dashboard" : "Get Started"}
                </button>
            </header>

            <section className="features-section">
                <div className="feature">
                    <h2>Track Carbon Emissions</h2>
                    <p>Monitor and analyze your carbon footprint across Scope 1, 2, and 3 emissions to make informed decisions.</p>
                </div>
                <div className="feature">
                    <h2>Explore and Analyze Data</h2>
                    <p>Dive into a diverse range of datasets while utilizing powerful tools to monitor trends and enhance your sustainability initiatives.</p>
                </div>
                <div className="feature">
                    <h2>Download Data</h2>
                    <p>Effortlessly export datasets in CSV format for detailed analysis and reporting to stakeholders.</p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>&copy; 2024 EcoMetrics. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
