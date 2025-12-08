import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, recipes: 0, ingredients: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Redirect if not admin
        if (user && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers()
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data.users);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setError('Failed to load admin dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await adminAPI.deleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.error || 'Failed to delete user');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-16 h-16"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient"></div>

            <div className="container-custom relative z-10">
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-display font-black mb-3 gradient-text-navy">
                        Admin Dashboard 🛡️
                    </h1>
                    <p className="text-xl text-neutral-600">
                        Manage users and system statistics
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="glass-card p-6 flex items-center justify-between">
                        <div>
                            <p className="text-neutral-500 font-medium">Total Users</p>
                            <h3 className="text-4xl font-bold text-neutral-800">{stats.users}</h3>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center justify-between">
                        <div>
                            <p className="text-neutral-500 font-medium">Total Recipes</p>
                            <h3 className="text-4xl font-bold text-neutral-800">{stats.recipes}</h3>
                        </div>
                        <div className="bg-accent-100 p-3 rounded-full text-accent-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>

                    <div className="glass-card p-6 flex items-center justify-between">
                        <div>
                            <p className="text-neutral-500 font-medium">Ingredients</p>
                            <h3 className="text-4xl font-bold text-neutral-800">{stats.ingredients}</h3>
                        </div>
                        <div className="bg-secondary-100 p-3 rounded-full text-secondary-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipes</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                    <div className="text-sm text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {u._count.recipes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {u.id !== user.id && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
