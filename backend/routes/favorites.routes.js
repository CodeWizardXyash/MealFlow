const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's favorite recipes
router.get('/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        // Ensure user can only access their own favorites
        if (userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                recipe: {
                    include: {
                        user: {
                            select: { id: true, name: true }
                        },
                        recipeIngredients: {
                            include: {
                                ingredient: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            favorites: favorites.map(fav => ({
                id: fav.id,
                createdAt: fav.createdAt,
                recipe: fav.recipe
            }))
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add recipe to favorites
router.post(
    '/',
    [
        body('recipeId').isInt().withMessage('Recipe ID is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { recipeId } = req.body;
            const userId = req.user.userId;

            // Check if already favorited
            const existing = await prisma.favorite.findUnique({
                where: {
                    userId_recipeId: {
                        userId,
                        recipeId
                    }
                }
            });

            if (existing) {
                return res.status(400).json({ error: 'Recipe already in favorites' });
            }

            // Check if recipe exists
            const recipe = await prisma.recipe.findUnique({
                where: { id: recipeId }
            });

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            const favorite = await prisma.favorite.create({
                data: {
                    userId,
                    recipeId
                },
                include: {
                    recipe: {
                        include: {
                            user: {
                                select: { id: true, name: true }
                            },
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
                message: 'Recipe added to favorites',
                favorite
            });
        } catch (error) {
            console.error('Add favorite error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Remove recipe from favorites
router.delete('/:id', async (req, res) => {
    try {
        const favoriteId = parseInt(req.params.id);

        // Verify favorite belongs to user
        const favorite = await prisma.favorite.findUnique({
            where: { id: favoriteId }
        });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        if (favorite.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await prisma.favorite.delete({
            where: { id: favoriteId }
        });

        res.json({ message: 'Recipe removed from favorites' });
    } catch (error) {
        console.error('Delete favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove favorite by recipe ID (alternative endpoint)
router.delete('/recipe/:recipeId', async (req, res) => {
    try {
        const recipeId = parseInt(req.params.recipeId);
        const userId = req.user.userId;

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId
                }
            }
        });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        await prisma.favorite.delete({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId
                }
            }
        });

        res.json({ message: 'Recipe removed from favorites' });
    } catch (error) {
        console.error('Delete favorite error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
