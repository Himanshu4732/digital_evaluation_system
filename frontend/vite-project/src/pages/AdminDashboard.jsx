import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/dashboard', {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };

        fetchDashboardData();
    }, []);

    if (!dashboardData) {
        return <div className="flex justify-center items-center h-screen bg-zinc-800 text-white">Loading...</div>;
    }

    return (
        <div className="bg-zinc-800 min-h-screen text-white">
            <Navbar />
            <div className="dashboard-container p-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">Admin Dashboard</h1>
                <p className="text-center text-zinc-400 mb-12">Welcome back! Here's an overview of your system's performance.</p>
                <div className="dashboard-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Teachers" value={dashboardData.totalTeachers} />
                    <StatCard title="Total Students" value={dashboardData.totalStudents} />
                    <StatCard title="Total Answer Papers" value={dashboardData.totalAnswerPapers} />
                    <StatCard title="Total Question Papers" value={dashboardData.totalQuestionPapers} />
                    <StatCard title="Total Feedbacks" value={dashboardData.totalFeedbacks} />
                </div>
                <div className="status-section mt-12">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Answer Papers Status</h2>
                    <p className="text-zinc-400 mb-6">Track the progress of answer papers in the system.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatusCard title="Assigned" value={dashboardData.answerPapersStatus.Assigned} />
                        <StatusCard title="Pending" value={dashboardData.answerPapersStatus.Pending} />
                        <StatusCard title="Evaluated" value={dashboardData.answerPapersStatus.Evaluated} />
                    </div>
                </div>
                <div className="status-section mt-12">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Feedback Messages Status</h2>
                    <p className="text-zinc-400 mb-6">Monitor the status of feedback messages from users.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatusCard title="Pending" value={dashboardData.feedbackMessagesStatus.Pending} />
                        <StatusCard title="Resolved" value={dashboardData.feedbackMessagesStatus.Resolved} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Navbar = () => (
    <nav className="navbar bg-blue-500 p-4 text-white shadow-lg">
        <ul className="flex justify-around">
            <li><Link to="/admin/profile" className="hover:underline hover:text-blue-200">Profile</Link></li>
            <li><Link to="/admin/logout" className="hover:underline hover:text-blue-200">Logout</Link></li>
        </ul>
    </nav>
);

const StatCard = ({ title, value }) => (
    <div className="stat-card bg-zinc-700 shadow-lg rounded-lg p-6 text-center hover:bg-zinc-600 transition duration-300">
        <h3 className="text-xl font-medium text-blue-400">{title}</h3>
        <p className="text-2xl font-bold mt-2 text-white">{value}</p>
    </div>
);

const StatusCard = ({ title, value }) => (
    <div className="status-card bg-zinc-700 shadow-lg rounded-lg p-6 text-center hover:bg-zinc-600 transition duration-300">
        <h3 className="text-lg font-medium text-blue-400">{title}</h3>
        <p className="text-xl font-semibold mt-2 text-white">{value}</p>
    </div>
);

export default AdminDashboard;