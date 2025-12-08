import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { favoritesAPI, recipeAPI } from '../services/api';

const RecipeCard = ({ recipe, onFavoriteToggle, onDelete, showActions = true }) => {
    const { id, title, description, prepTime, cookTime, servings, tags, imageUrl, isFavorite, userId } = recipe;
    const { user } = useAuth();
    const navigate = useNavigate();

    const totalTime = (prepTime || 0) + (cookTime || 0);
    const isOwner = user && user.id === userId;

    const handleFavoriteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If a handler is provided, let the parent handle EVERYTHING (API + State)
        if (onFavoriteToggle) {
            onFavoriteToggle(id);
            return;
        }

        // Otherwise handle it locally (fallback behavior)
        try {
            if (isFavorite) {
                await favoritesAPI.removeByRecipeId(id);
            } else {
                await favoritesAPI.add(id);
            }
            // We can't update state here easily without parent, forcing reload or parent state is best
            // But this path is likely unused in current app structure
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/recipe-builder/${id}`);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this recipe? This cannot be undone.')) {
            try {
                await recipeAPI.delete(id);
                if (onDelete) {
                    onDelete(id);
                }
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    const [imageError, setImageError] = useState(false);

    // Reset error loading when URL changes
    useEffect(() => {
        setImageError(false);
    }, [imageUrl]);

    return (
        <Link to={`/recipes/${id}`} className="recipe-card block group relative">
            {/* Image */}
            <div className="recipe-card-image h-48 overflow-hidden rounded-t-xl bg-neutral-100">
                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100">
                        <span className="text-4xl" role="img" aria-label="meal">🍳</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="recipe-card-content p-4">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-neutral-950 flex-1 line-clamp-1">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        {/* Favorite Button */}
                        <button
                            onClick={handleFavoriteClick}
                            className={`text-neutral-400 hover:text-red-500 transition-colors ${isFavorite ? 'text-red-500' : ''}`}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {description && (
                    <p className="text-neutral-600 mb-4 line-clamp-2 text-sm">
                        {description}
                    </p>
                )}

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                        {totalTime > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {totalTime} min
                            </span>
                        )}
                        {servings && (
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                {servings}
                            </span>
                        )}
                    </div>

                    {/* Owner Actions */}
                    {isOwner && showActions && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleEdit}
                                className="p-1.5 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit Recipe"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete Recipe"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
