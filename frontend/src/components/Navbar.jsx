import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-neutral-950 hover:text-primary-600 transition-colors">
                        MealFlow
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-8">
                        {user ? (
                            <>
                                <Link to="/recipes" className="nav-link">
                                    Recipes
                                </Link>
                                <Link to="/planner" className="nav-link">
                                    Planner
                                </Link>
                                <Link to="/favorites" className="nav-link">
                                    Favorites
                                </Link>
                                <Link to="/grocery-list" className="nav-link">
                                    Grocery List
                                </Link>
                                <Link to="/profile" className="nav-link">
                                    Profile
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <Link to="/admin" className="nav-link text-purple-600 font-semibold">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
