import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RecipeBuilder = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        tags: [],
        imageUrl: '',
    });

    const [instructions, setInstructions] = useState(['']);
    const [ingredients, setIngredients] = useState([
        { name: '', quantity: '', unit: '', category: '' }
    ]);

    const availableTags = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian', 'Vegan', 'Quick', 'Healthy'];
    const categories = ['Vegetables', 'Meat', 'Dairy', 'Grains', 'Spices', 'Oils', 'Other'];

    useEffect(() => {
        if (isEditMode) {
            fetchRecipeData();
        }
    }, [id]);

    const fetchRecipeData = async () => {
        try {
            setFetching(true);
            const response = await recipeAPI.getById(id);
            const recipe = response.data.recipe;

            // Check ownership
            if (user && recipe.userId !== user.id) {
                navigate('/recipes');
                return;
            }

            setFormData({
                title: recipe.title || '',
                description: recipe.description || '',
                prepTime: recipe.prepTime || '',
                cookTime: recipe.cookTime || '',
                servings: recipe.servings || '',
                tags: recipe.tags || [],
                imageUrl: recipe.imageUrl || '',
            });

            setInstructions(recipe.instructions.length > 0 ? recipe.instructions : ['']);

            // Map ingredients from recipeIngredients structure
            if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
                setIngredients(recipe.recipeIngredients.map(ri => ({
                    name: ri.ingredient.name,
                    quantity: ri.quantity,
                    unit: ri.ingredient.unit,
                    category: ri.ingredient.category
                })));
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
            setError('Failed to load recipe data');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleTag = (tag) => {
        if (formData.tags.includes(tag)) {
            setFormData({
                ...formData,
                tags: formData.tags.filter(t => t !== tag),
            });
        } else {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag],
            });
        }
    };

    const addInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const updateInstruction = (index, value) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const removeInstruction = (index) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '', category: '' }]);
    };

    const updateIngredient = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate
            if (!formData.title.trim()) {
                setError('Title is required');
                setLoading(false);
                return;
            }

            const validInstructions = instructions.filter(inst => inst.trim() !== '');
            if (validInstructions.length === 0) {
                setError('At least one instruction is required');
                setLoading(false);
                return;
            }

            const validIngredients = ingredients.filter(ing => ing.name.trim() !== '');
            if (validIngredients.length === 0) {
                setError('At least one ingredient is required');
                setLoading(false);
                return;
            }

            const recipeData = {
                ...formData,
                prepTime: parseInt(formData.prepTime) || null,
                cookTime: parseInt(formData.cookTime) || null,
                servings: parseInt(formData.servings) || 1,
                instructions: validInstructions,
                ingredients: validIngredients.map(ing => ({
                    name: ing.name,
                    quantity: parseFloat(ing.quantity) || 1,
                    unit: ing.unit || 'units',
                    category: ing.category || 'Other',
                })),
            };

            if (isEditMode) {
                await recipeAPI.update(id, recipeData);
            } else {
                await recipeAPI.create(recipeData);
            }

            navigate('/recipes');
        } catch (error) {
            console.error('Error saving recipe:', error);
            setError(error.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} recipe`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen py-20 flex justify-center items-center">
                <div className="spinner w-12 h-12"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient"></div>

            <div className="container-custom max-w-4xl relative z-10">
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-display font-black mb-3 gradient-text-navy">
                        {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
                    </h1>
                    <p className="text-xl text-neutral-600">
                        {isEditMode ? 'Update your delicious creation' : 'Share your culinary creation with the community'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {error && (
                        <div className="bg-secondary-50 border border-secondary-200 text-secondary-800 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="label">Recipe Title *</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., Spaghetti Carbonara"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="label">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input"
                                    rows="3"
                                    placeholder="Brief description of your recipe..."
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="prepTime" className="label">Prep Time (min)</label>
                                    <input
                                        id="prepTime"
                                        name="prepTime"
                                        type="number"
                                        value={formData.prepTime}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="30"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cookTime" className="label">Cook Time (min)</label>
                                    <input
                                        id="cookTime"
                                        name="cookTime"
                                        type="number"
                                        value={formData.cookTime}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="45"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="servings" className="label">Servings</label>
                                    <input
                                        id="servings"
                                        name="servings"
                                        type="number"
                                        value={formData.servings}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="4"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="imageUrl" className="label">Image URL (optional)</label>
                                <input
                                    id="imageUrl"
                                    name="imageUrl"
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div>
                                <label className="label mb-3">Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={`tag-pill ${formData.tags.includes(tag)
                                                ? 'tag-pill-active'
                                                : 'tag-pill-inactive'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Ingredients *</h2>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="btn btn-outline text-sm"
                            >
                                + Add Ingredient
                            </button>
                        </div>

                        <div className="space-y-3">
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <input
                                        type="text"
                                        value={ingredient.name}
                                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                        className="input flex-1"
                                        placeholder="Ingredient name"
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={ingredient.quantity}
                                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                        className="input w-24"
                                        placeholder="Qty"
                                    />
                                    <input
                                        type="text"
                                        value={ingredient.unit}
                                        onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                        className="input w-28"
                                        placeholder="Unit"
                                    />
                                    <select
                                        value={ingredient.category}
                                        onChange={(e) => updateIngredient(index, 'category', e.target.value)}
                                        className="input w-36"
                                    >
                                        <option value="">Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            className="btn btn-danger text-sm px-3"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Instructions *</h2>
                            <button
                                type="button"
                                onClick={addInstruction}
                                className="btn btn-outline text-sm"
                            >
                                + Add Step
                            </button>
                        </div>

                        <div className="space-y-3">
                            {instructions.map((instruction, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <span className="text-gray-500 font-medium mt-2 min-w-[30px]">
                                        {index + 1}.
                                    </span>
                                    <textarea
                                        value={instruction}
                                        onChange={(e) => updateInstruction(index, e.target.value)}
                                        className="input flex-1"
                                        rows="2"
                                        placeholder="Describe this step..."
                                    />
                                    {instructions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(index)}
                                            className="btn btn-danger text-sm px-3 mt-1"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex-1 py-3 font-semibold disabled:opacity-50"
                        >
                            {loading ? (isEditMode ? 'Updating Recipe...' : 'Creating Recipe...') : (isEditMode ? 'Update Recipe' : 'Create Recipe')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/recipes')}
                            className="btn btn-secondary px-8 py-3"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecipeBuilder;
