const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Helper function to get start and end of current week
function getCurrentWeekDates() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
}

// Get weekly meal plan
router.get('/weekly/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        // Ensure user can only access their own plan
        if (userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { weekStart, weekEnd } = getCurrentWeekDates();

        // Find or create weekly plan
        let weeklyPlan = await prisma.weeklyPlan.findFirst({
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
                    },
                    orderBy: [
                        { dayOfWeek: 'asc' },
                        { mealType: 'asc' }
                    ]
                }
            }
        });

        if (!weeklyPlan) {
            weeklyPlan = await prisma.weeklyPlan.create({
                data: {
                    userId,
                    weekStart,
                    weekEnd
                },
                include: {
                    plannerEntries: true
                }
            });
        }

        res.json({ weeklyPlan });
    } catch (error) {
        console.error('Get weekly plan error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add recipe to planner
router.post(
    '/entry',
    [
        body('recipeId').isInt().withMessage('Recipe ID is required'),
        body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
        body('mealType').isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']).withMessage('Invalid meal type')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { recipeId, dayOfWeek, mealType } = req.body;
            const userId = req.user.userId;

            const { weekStart, weekEnd } = getCurrentWeekDates();

            // Find or create weekly plan
            let weeklyPlan = await prisma.weeklyPlan.findFirst({
                where: {
                    userId,
                    weekStart: {
                        gte: weekStart,
                        lte: weekEnd
                    }
                }
            });

            if (!weeklyPlan) {
                weeklyPlan = await prisma.weeklyPlan.create({
                    data: {
                        userId,
                        weekStart,
                        weekEnd
                    }
                });
            }

            // Create planner entry
            const plannerEntry = await prisma.plannerEntry.create({
                data: {
                    weeklyPlanId: weeklyPlan.id,
                    recipeId,
                    dayOfWeek,
                    mealType
                },
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
            });

            res.status(201).json({
                message: 'Recipe added to planner',
                plannerEntry
            });
        } catch (error) {
            console.error('Add planner entry error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Update planner entry
router.put(
    '/entry/:id',
    [
        body('dayOfWeek').optional().isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
        body('mealType').optional().isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack']).withMessage('Invalid meal type')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const entryId = parseInt(req.params.id);
            const { dayOfWeek, mealType } = req.body;

            // Verify entry belongs to user
            const entry = await prisma.plannerEntry.findUnique({
                where: { id: entryId },
                include: {
                    weeklyPlan: true
                }
            });

            if (!entry) {
                return res.status(404).json({ error: 'Planner entry not found' });
            }

            if (entry.weeklyPlan.userId !== req.user.userId) {
                return res.status(403).json({ error: 'Access denied' });
            }

            const updateData = {};
            if (dayOfWeek !== undefined) updateData.dayOfWeek = dayOfWeek;
            if (mealType) updateData.mealType = mealType;

            const updatedEntry = await prisma.plannerEntry.update({
                where: { id: entryId },
                data: updateData,
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
            });

            res.json({
                message: 'Planner entry updated',
                plannerEntry: updatedEntry
            });
        } catch (error) {
            console.error('Update planner entry error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Delete planner entry
router.delete('/entry/:id', async (req, res) => {
    try {
        const entryId = parseInt(req.params.id);

        // Verify entry belongs to user
        const entry = await prisma.plannerEntry.findUnique({
            where: { id: entryId },
            include: {
                weeklyPlan: true
            }
        });

        if (!entry) {
            return res.status(404).json({ error: 'Planner entry not found' });
        }

        if (entry.weeklyPlan.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await prisma.plannerEntry.delete({
            where: { id: entryId }
        });

        res.json({ message: 'Recipe removed from planner' });
    } catch (error) {
        console.error('Delete planner entry error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
