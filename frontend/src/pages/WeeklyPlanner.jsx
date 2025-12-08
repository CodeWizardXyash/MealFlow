import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { recipeAPI, plannerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const WeeklyPlanner = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [weeklyPlan, setWeeklyPlan] = useState(null);
    const [plannerEntries, setPlannerEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const dayColors = [
        'from-primary-500 to-primary-600',
        'from-accent-500 to-accent-600',
        'from-secondary-500 to-secondary-600',
        'from-primary-600 to-accent-600',
        'from-accent-600 to-secondary-600',
        'from-primary-500 to-secondary-500',
        'from-accent-500 to-primary-600',
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [recipesRes, planRes] = await Promise.all([
                recipeAPI.getAll({ limit: 100 }),
                plannerAPI.getWeeklyPlan(user.id),
            ]);

            setRecipes(recipesRes.data.recipes);
            setWeeklyPlan(planRes.data.weeklyPlan);
            setPlannerEntries(planRes.data.weeklyPlan.plannerEntries || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const recipeId = parseInt(draggableId.replace('recipe-', ''));
        const [destDay, destMeal] = destination.droppableId.split('-');
        const dayOfWeek = daysOfWeek.indexOf(destDay);

        try {
            const response = await plannerAPI.addEntry({
                recipeId,
                dayOfWeek,
                mealType: destMeal,
            });

            setPlannerEntries([...plannerEntries, response.data.plannerEntry]);
        } catch (error) {
            console.error('Error adding to planner:', error);
        }
    };

    const removeFromPlanner = async (entryId) => {
        try {
            await plannerAPI.deleteEntry(entryId);
            setPlannerEntries(plannerEntries.filter(entry => entry.id !== entryId));
        } catch (error) {
            console.error('Error removing from planner:', error);
        }
    };

    const getEntriesForSlot = (dayIndex, mealType) => {
        return plannerEntries.filter(
            entry => entry.dayOfWeek === dayIndex && entry.mealType === mealType
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-16 h-16"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-neutral-50">
            <div className="container-custom max-w-7xl">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-neutral-900 mb-3">
                            Weekly Meal Planner
                        </h1>
                        <p className="text-lg text-neutral-600">Drag recipes to plan your perfect week</p>
                    </div>
                    <Link
                        to="/grocery-list"
                        className="btn btn-primary px-6 py-3 hidden md:inline-flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Generate Grocery List
                    </Link>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Recipe Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="card bg-white sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                                <h2 className="text-xl font-bold mb-4 text-neutral-900">Available Recipes</h2>
                                <Droppable droppableId="recipes-sidebar" isDropDisabled={true}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="space-y-3"
                                        >
                                            {recipes.map((recipe, index) => (
                                                <Draggable
                                                    key={recipe.id}
                                                    draggableId={`recipe-${recipe.id}`}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`p-4 bg-white border border-neutral-200 rounded-lg cursor-grab hover:border-primary-500 hover:shadow-md transition-all duration-200 ${snapshot.isDragging ? 'shadow-lg border-primary-500 ring-2 ring-primary-100' : ''
                                                                }`}
                                                        >
                                                            <h3 className="font-semibold text-sm line-clamp-2 text-neutral-900">
                                                                {recipe.title}
                                                            </h3>
                                                            {recipe.tags && recipe.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {recipe.tags.slice(0, 2).map((tag, i) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs border border-neutral-200">
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>

                        {/* Weekly Calendar */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                {daysOfWeek.map((day, dayIndex) => (
                                    <div key={day} className="flex flex-col h-full">
                                        <h3 className="text-center font-bold text-neutral-800 mb-3 pb-2 border-b-2 border-primary-100">
                                            {day}
                                        </h3>

                                        <div className="space-y-3 flex-grow">
                                            {mealTypes.map((mealType) => {
                                                const entries = getEntriesForSlot(dayIndex, mealType);

                                                return (
                                                    <Droppable
                                                        key={`${day}-${mealType}`}
                                                        droppableId={`${day}-${mealType}`}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                                className={`p-3 rounded-lg min-h-[100px] border border-dashed transition-colors duration-200 ${snapshot.isDraggingOver
                                                                    ? 'bg-primary-50 border-primary-300'
                                                                    : entries.length > 0
                                                                        ? 'bg-white border-neutral-200'
                                                                        : 'bg-neutral-50 border-neutral-200'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                                                                        {mealType}
                                                                    </p>
                                                                    {entries.length > 0 && (
                                                                        <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full font-medium">
                                                                            {entries.length}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {entries.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        {entries.map((entry) => (
                                                                            <div
                                                                                key={entry.id}
                                                                                className="bg-white border border-neutral-200 rounded p-2 group relative shadow-sm hover:border-primary-300 transition-all"
                                                                            >
                                                                                <p className="text-xs font-medium text-neutral-900 pr-5 line-clamp-3">
                                                                                    {entry.recipe.title}
                                                                                </p>
                                                                                <button
                                                                                    onClick={() => removeFromPlanner(entry.id)}
                                                                                    className="absolute top-1 right-1 w-5 h-5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                                                >
                                                                                    ✕
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-neutral-400 text-center py-4">
                                                                        Drop here
                                                                    </p>
                                                                )}

                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DragDropContext>

                {/* Mobile Grocery List Button */}
                <div className="mt-8 md:hidden">
                    <Link
                        to="/grocery-list"
                        className="btn btn-primary w-full py-4 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Generate Grocery List
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WeeklyPlanner;
