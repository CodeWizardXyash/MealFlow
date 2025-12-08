const express = require('express');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Helper function to get start and end of current week
function getCurrentWeekDates() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
}

// Generate grocery list from weekly plan
router.get('/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        // Ensure user can only access their own grocery list
        if (userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { weekStart, weekEnd } = getCurrentWeekDates();

        // Get weekly plan with all recipes and ingredients
        const weeklyPlan = await prisma.weeklyPlan.findFirst({
            where: {
                userId,
                weekStart: {
                    gte: weekStart,
                    lte: weekEnd
                }
            },
            include: {
                plannerEntries: {
                    include: {
                        recipe: {
                            include: {
                                recipeIngredients: {
                                    include: {
                                        ingredient: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!weeklyPlan || weeklyPlan.plannerEntries.length === 0) {
            return res.json({
                groceryList: [],
                message: 'No recipes in weekly plan'
            });
        }

        // Aggregate ingredients
        const ingredientMap = new Map();

        weeklyPlan.plannerEntries.forEach(entry => {
            entry.recipe.recipeIngredients.forEach(recipeIng => {
                const key = recipeIng.ingredient.name;

                if (ingredientMap.has(key)) {
                    const existing = ingredientMap.get(key);
                    existing.quantity += recipeIng.quantity;
                } else {
                    ingredientMap.set(key, {
                        name: recipeIng.ingredient.name,
                        category: recipeIng.ingredient.category,
                        unit: recipeIng.ingredient.unit,
                        quantity: recipeIng.quantity
                    });
                }
            });
        });

        // Convert map to array and group by category
        const groceryList = Array.from(ingredientMap.values());

        // Group by category
        const groupedByCategory = groceryList.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        res.json({
            groceryList: groupedByCategory,
            totalItems: groceryList.length,
            weekStart,
            weekEnd
        });
    } catch (error) {
        console.error('Generate grocery list error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
