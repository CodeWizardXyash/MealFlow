import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Minimal & Bold */}
            <section className="hero-section">
                <div className="container-custom">
                    <div className="max-w-4xl">
                        <h1 className="text-6xl lg:text-8xl font-bold text-neutral-950 mb-8 leading-tight">
                            Plan meals.<br />
                            Save time.<br />
                            Eat better.
                        </h1>
                        <p className="text-xl lg:text-2xl text-neutral-600 mb-12 max-w-2xl leading-relaxed">
                            MealFlow helps you organize recipes, plan weekly meals, and generate grocery lists automatically.
                        </p>
                        <div className="flex gap-4">
                            {user ? (
                                <Link to="/recipes" className="btn btn-primary text-lg px-8 py-4">
                                    Browse Recipes
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="btn btn-outline text-lg px-8 py-4">
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Grid Layout */}
            <section className="section bg-neutral-50">
                <div className="container-custom">
                    <h2 className="text-4xl lg:text-5xl font-bold text-neutral-950 mb-16">
                        Everything you need
                    </h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div>
                            <div className="w-12 h-12 bg-primary-600 rounded mb-6"></div>
                            <h3 className="text-2xl font-bold text-neutral-950 mb-4">
                                Recipe Library
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Create and organize your favorite recipes. Add ingredients, instructions, and cooking times.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div>
                            <div className="w-12 h-12 bg-primary-600 rounded mb-6"></div>
                            <h3 className="text-2xl font-bold text-neutral-950 mb-4">
                                Weekly Planner
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Drag and drop recipes into your weekly calendar. Plan breakfast, lunch, and dinner for the entire week.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div>
                            <div className="w-12 h-12 bg-primary-600 rounded mb-6"></div>
                            <h3 className="text-2xl font-bold text-neutral-950 mb-4">
                                Smart Grocery Lists
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Automatically generate grocery lists from your meal plan. Ingredients are organized by category.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-neutral-950 mb-8">
                            Ready to get started?
                        </h2>
                        <p className="text-xl text-neutral-600 mb-12">
                            Join MealFlow today and simplify your meal planning.
                        </p>
                        {!user && (
                            <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                                Create Account
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-200 py-12">
                <div className="container-custom">
                    <div className="text-center text-neutral-600">
                        <p>&copy; 2024 MealFlow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
