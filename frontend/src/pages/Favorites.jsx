import { useState, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await favoritesAPI.getAll(user.id);
            setFavorites(response.data.favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (recipeId) => {
        try {
            await favoritesAPI.removeByRecipeId(recipeId);
            setFavorites(favorites.filter(fav => fav.recipe.id !== recipeId));
        } catch (error) {
            console.error('Error removing favorite:', error);
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
                        Favorite Recipes ❤️
                    </h1>
                    <p className="text-xl text-neutral-600">
                        Your saved recipes for quick access
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <div className="glass-card text-center py-16 animate-fade-in-up">
                        <svg
                            className="w-24 h-24 text-secondary-400 mx-auto mb-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <h3 className="text-3xl font-display font-bold text-neutral-700 mb-3">
                            No favorite recipes yet
                        </h3>
                        <p className="text-neutral-500 mb-8 text-lg">
                            Start adding recipes to your favorites to see them here
                        </p>
                        <Link to="/recipes" className="btn btn-primary px-8 py-4 inline-block shadow-glow-sm">
                            Browse Recipes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((favorite, index) => (
                            <div
                                key={favorite.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <RecipeCard
                                    recipe={{ ...favorite.recipe, isFavorite: true }}
                                    onFavoriteToggle={handleRemoveFavorite}
                                    showActions={false}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
