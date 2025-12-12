import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Admin Stats</h2>
                <p className="text-gray-600">Welcome to the Admin Dashboard. Here you can manage users, view system stats, and more.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-800">Total Users</h3>
                        <p className="text-2xl font-bold text-blue-900">12,345</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-medium text-green-800">Total Revenue</h3>
                        <p className="text-2xl font-bold text-green-900">$54,321</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-medium text-purple-800">Active Sessions</h3>
                        <p className="text-2xl font-bold text-purple-900">123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
