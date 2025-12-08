import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

const Recipes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const availableTags = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian', 'Vegan', 'Quick', 'Healthy'];

    useEffect(() => {
        fetchRecipes();
        fetchFavorites();
    }, [searchTerm, selectedTags, sortBy, currentPage]);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 12,
                sortBy,
                order: 'desc',
            };

            if (searchTerm) params.search = searchTerm;
            if (selectedTags.length > 0) params.tags = selectedTags.join(',');

            const response = await recipeAPI.getAll(params);
            setRecipes(response.data.recipes);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await favoritesAPI.getAll(user.id);
            setFavorites(response.data.favorites.map(fav => fav.recipe.id));
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const handleFavorite = async (recipeId) => {
        try {
            if (favorites.includes(recipeId)) {
                await favoritesAPI.removeByRecipeId(recipeId);
                setFavorites(favorites.filter(id => id !== recipeId));
            } else {
                await favoritesAPI.add(recipeId);
                setFavorites([...favorites, recipeId]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDelete = (recipeId) => {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen py-8 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient"></div>

            <div className="container-custom relative z-10">
                <div className="mb-10 animate-fade-in-up flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-display font-black mb-3 gradient-text-navy">
                            Recipe Collection
                        </h1>
                        <p className="text-xl text-neutral-600">Discover and explore delicious recipes</p>
                    </div>
                    {user && user.role === 'ADMIN' && (
                        <button
                            onClick={() => navigate('/recipe-builder')}
                            className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Recipe
                        </button>
                    )}
                </div>

                {/* Search and Filters - Glassmorphic */}
                <div className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search recipes by title or description..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="input pl-12"
                            />
                        </div>
                    </div>

                    {/* Tags Filter */}
                    <div className="mb-6">
                        <label className="label mb-3">Filter by Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`tag-pill ${selectedTags.includes(tag)
                                        ? 'tag-pill-active'
                                        : 'tag-pill-inactive'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center gap-4">
                        <label className="label mb-0">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input w-auto"
                        >
                            <option value="createdAt">Newest First</option>
                            <option value="rating">Highest Rated</option>
                            <option value="title">Title (A-Z)</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="spinner w-16 h-16"></div>
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="text-center py-20 glass-card animate-fade-in-up">
                        <svg
                            className="w-20 h-20 text-neutral-400 mx-auto mb-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-2xl font-display font-bold text-neutral-700 mb-2">No recipes found</h3>
                        <p className="text-neutral-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        {/* Recipe Grid - Masonry Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {recipes.map((recipe, index) => (
                                <div
                                    key={recipe.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${0.1 + (index % 9) * 0.05}s` }}
                                >
                                    <RecipeCard
                                        recipe={recipe}
                                        onFavoriteToggle={handleFavorite} // Corrected prop name
                                        onDelete={handleDelete}
                                    // isFavorited is now inside recipe object from API or handled in card
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination - Premium Design */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 animate-fade-in-up">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="btn bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 hover:from-neutral-200 hover:to-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="glass-card px-6 py-3">
                                    <span className="font-bold text-neutral-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="btn bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 hover:from-neutral-200 hover:to-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div >
    );
};

export default Recipes;
