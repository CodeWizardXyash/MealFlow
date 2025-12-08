import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const response = await userAPI.getProfile(user.id);
            setStats(response.data.user._count);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await userAPI.updateProfile(user.id, formData);
            updateUser(response.data.user);
            setSuccess('Profile updated successfully!');
            setEditing(false);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setEditing(false);
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen py-12 bg-neutral-50">
            <div className="container-custom max-w-4xl">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-3">
                        My Profile
                    </h1>
                    <p className="text-lg text-neutral-600">Manage your account information</p>
                </div>

                {/* Stats Cards - Simple Design */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card text-center p-8">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 mb-1">
                            {stats?.recipes || 0}
                        </p>
                        <p className="text-sm font-medium text-neutral-600">Recipes Created</p>
                    </div>

                    <div className="card text-center p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 mb-1">
                            {stats?.favorites || 0}
                        </p>
                        <p className="text-sm font-medium text-neutral-600">Favorites</p>
                    </div>

                    <div className="card text-center p-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 mb-1">
                            {stats?.weeklyPlans || 0}
                        </p>
                        <p className="text-sm font-medium text-neutral-600">Weekly Plans</p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="card bg-white p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">Account Information</h2>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="btn btn-outline"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="alert alert-error mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success mb-6">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="label">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="input disabled:bg-neutral-50 disabled:text-neutral-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="label">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    className="input disabled:bg-neutral-50 disabled:text-neutral-500"
                                />
                            </div>

                            <div>
                                <label className="label">Member Since</label>
                                <p className="text-neutral-900 font-medium text-lg">
                                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>

                            {editing && (
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary flex-1 py-3 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 flex-1 py-3"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
