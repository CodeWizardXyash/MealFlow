import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import RecipeBuilder from './pages/RecipeBuilder';
import WeeklyPlanner from './pages/WeeklyPlanner';
import GroceryList from './pages/GroceryList';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// import CursorSmokeEffect from './components/CursorSmokeEffect';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/recipes"
                            element={
                                <ProtectedRoute>
                                    <Recipes />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/recipe-builder"
                            element={
                                <ProtectedRoute>
                                    <RecipeBuilder />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/planner"
                            element={
                                <ProtectedRoute>
                                    <WeeklyPlanner />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/grocery-list"
                            element={
                                <ProtectedRoute>
                                    <GroceryList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/favorites"
                            element={
                                <ProtectedRoute>
                                    <Favorites />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
