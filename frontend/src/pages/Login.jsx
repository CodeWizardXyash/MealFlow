import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import foodBg from '../assets/food_background_1.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/recipes');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen auth-background flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-950 mb-3">
                        Sign In
                    </h1>
                    <p className="text-neutral-600">
                        Welcome back to MealFlow
                    </p>
                </div>

                <div className="card bg-white/95 backdrop-blur-sm">
                    {error && (
                        <div className="alert alert-error mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-neutral-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
