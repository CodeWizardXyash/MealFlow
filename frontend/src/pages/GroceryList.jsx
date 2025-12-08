import { useState, useEffect } from 'react';
import { groceryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const GroceryList = () => {
    const { user } = useAuth();
    const [groceryList, setGroceryList] = useState({});
    const [loading, setLoading] = useState(true);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    useEffect(() => {
        fetchGroceryList();
    }, []);

    useEffect(() => {
        // Expand all categories by default
        setExpandedCategories(new Set(Object.keys(groceryList)));
    }, [groceryList]);

    const fetchGroceryList = async () => {
        try {
            setLoading(true);
            const response = await groceryAPI.getList(user.id);
            setGroceryList(response.data.groceryList);
        } catch (error) {
            console.error('Error fetching grocery list:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = (itemName) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(itemName)) {
            newChecked.delete(itemName);
        } else {
            newChecked.add(itemName);
        }
        setCheckedItems(newChecked);
    };

    const toggleCategory = (category) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const handlePrint = () => {
        window.print();
    };

    const categories = Object.keys(groceryList);
    const totalItems = categories.reduce(
        (sum, cat) => sum + groceryList[cat].length,
        0
    );

    const categoryColors = {
        'Dairy': 'from-primary-500 to-primary-600',
        'Vegetables': 'from-accent-500 to-accent-600',
        'Meat': 'from-secondary-500 to-secondary-600',
        'Grains': 'from-primary-600 to-accent-600',
        'Fruits': 'from-accent-600 to-secondary-600',
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

            <div className="container-custom max-w-4xl relative z-10">
                <div className="mb-10 flex items-center justify-between animate-fade-in-up">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-display font-black mb-3 gradient-text-navy">
                            Grocery List 🛒
                        </h1>
                        <p className="text-xl text-neutral-600">
                            Auto-generated from your weekly meal plan
                        </p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="btn bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 hover:from-neutral-200 hover:to-neutral-300 hidden md:flex items-center gap-2 shadow-sm"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                        </svg>
                        Print List
                    </button>
                </div>

                {categories.length === 0 ? (
                    <div className="glass-card text-center py-16 animate-fade-in-up">
                        <svg
                            className="w-24 h-24 text-neutral-400 mx-auto mb-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="text-3xl font-display font-bold text-neutral-700 mb-3">
                            No items in grocery list
                        </h3>
                        <p className="text-neutral-500 mb-8 text-lg">
                            Add recipes to your weekly planner to generate a grocery list
                        </p>
                        <Link to="/planner" className="btn btn-primary px-8 py-4 inline-block shadow-glow-sm">
                            Go to Weekly Planner
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Summary - Premium Design */}
                        <div className="glass-card mb-8 animate-fade-in-up">
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <p className="text-sm font-semibold text-neutral-600 mb-2">Total Items</p>
                                    <p className="text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                        {totalItems}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-600 mb-2">Checked</p>
                                    <p className="text-4xl font-black bg-gradient-to-r from-accent-600 to-accent-800 bg-clip-text text-transparent">
                                        {checkedItems.size}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-600 mb-2">Remaining</p>
                                    <p className="text-4xl font-black bg-gradient-to-r from-secondary-600 to-secondary-800 bg-clip-text text-transparent">
                                        {totalItems - checkedItems.size}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Grocery List by Category - Collapsible */}
                        <div className="space-y-4">
                            {categories.map((category, index) => {
                                const isExpanded = expandedCategories.has(category);
                                const categoryColor = categoryColors[category] || 'from-primary-500 to-primary-600';

                                return (
                                    <div
                                        key={category}
                                        className="glass-card animate-fade-in-up"
                                        style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                                    >
                                        <button
                                            onClick={() => toggleCategory(category)}
                                            className="w-full flex items-center justify-between mb-4 group"
                                        >
                                            <h2 className={`text-2xl font-display font-black bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent`}>
                                                {category}
                                                <span className="ml-3 text-sm bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 px-3 py-1 rounded-full">
                                                    {groceryList[category].length}
                                                </span>
                                            </h2>
                                            <svg
                                                className={`w-6 h-6 text-neutral-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {isExpanded && (
                                            <div className="space-y-2">
                                                {groceryList[category].map((item, itemIndex) => {
                                                    const itemKey = `${category}-${item.name}`;
                                                    const isChecked = checkedItems.has(itemKey);

                                                    return (
                                                        <div
                                                            key={itemIndex}
                                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 group"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                id={itemKey}
                                                                checked={isChecked}
                                                                onChange={() => toggleItem(itemKey)}
                                                                className="w-6 h-6 text-primary-600 rounded-lg focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all"
                                                            />
                                                            <label
                                                                htmlFor={itemKey}
                                                                className={`flex-1 cursor-pointer transition-all duration-300 ${isChecked ? 'line-through text-neutral-400' : 'text-neutral-900 font-medium'
                                                                    }`}
                                                            >
                                                                <span className="text-base">{item.name}</span>
                                                                <span className="text-neutral-500 ml-2">
                                                                    - {item.quantity} {item.unit}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container-custom, .container-custom * {
            visibility: visible;
          }
          .container-custom {
            position: absolute;
            left: 0;
            top: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
};

export default GroceryList;
