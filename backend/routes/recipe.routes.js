const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all recipes with search, filter, sort, and pagination
router.get('/', async (req, res) => {
    try {
        const {
            search,
            tags,
            ingredients,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Build where clause
        const where = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            where.tags = { hasSome: tagArray };
        }

        if (ingredients) {
            const ingredientArray = ingredients.split(',').map(ing => ing.trim());
            where.recipeIngredients = {
                some: {
                    ingredient: {
                        name: { in: ingredientArray, mode: 'insensitive' }
                    }
                }
            };
        }

        // Get recipes
        const [recipes, total] = await Promise.all([
            prisma.recipe.findMany({
                where,
                skip,
                take,
                orderBy: { [sortBy]: order },
                include: {
                    user: {
                        select: { id: true, name: true }
                    },
                    recipeIngredients: {
                        include: {
                            ingredient: true
                        }
                    },
                    _count: {
                        select: { favorites: true }
                    }
                }
            }),
            prisma.recipe.count({ where })
        ]);

        res.json({
            recipes,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get recipes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);

        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            include: {
                user: {
                    select: { id: true, name: true }
                },
                recipeIngredients: {
                    include: {
                        ingredient: true
                    }
                },
                _count: {
                    select: { favorites: true }
                }
            }
        });

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json({ recipe });
    } catch (error) {
        console.error('Get recipe error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new recipe
router.post(
    '/',
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('instructions').isArray().withMessage('Instructions must be an array'),
        body('ingredients').isArray().withMessage('Ingredients must be an array')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Check for admin role
            if (req.user.role !== 'ADMIN') {
                return res.status(403).json({ error: 'Access denied. Only admins can create recipes.' });
            }

            const {
                title,
                description,
                instructions,
                tags,
                rating,
                imageUrl,
                prepTime,
                cookTime,
                servings,
                ingredients
            } = req.body;

            // Create recipe with ingredients
            const recipe = await prisma.recipe.create({
                data: {
                    title,
                    description,
                    instructions,
                    tags: tags || [],
                    rating,
                    imageUrl,
                    prepTime,
                    cookTime,
                    servings,
                    userId: req.user.userId,
                    recipeIngredients: {
                        create: await Promise.all(
                            ingredients.map(async (ing) => {
                                // Find or create ingredient
                                let ingredient = await prisma.ingredient.findUnique({
                                    where: { name: ing.name }
                                });

                                if (!ingredient) {
                                    ingredient = await prisma.ingredient.create({
                                        data: {
                                            name: ing.name,
                                            category: ing.category || 'Other',
                                            unit: ing.unit || 'units'
                                        }
                                    });
                                }

                                return {
                                    ingredientId: ingredient.id,
                                    quantity: ing.quantity
                                };
                            })
                        )
                    }
                },
                include: {
                    recipeIngredients: {
                        include: {
                            ingredient: true
                        }
                    }
                }
            });

            res.status(201).json({
                message: 'Recipe created successfully',
                recipe
            });
        } catch (error) {
            console.error('Create recipe error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// Update recipe
router.put('/:id', async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);

        // Check if recipe exists and belongs to user
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id: recipeId }
        });

        if (!existingRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (existingRecipe.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const {
            title,
            description,
            instructions,
            tags,
            rating,
            imageUrl,
            prepTime,
            cookTime,
            servings,
            ingredients
        } = req.body;

        // Update recipe
        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (instructions) updateData.instructions = instructions;
        if (tags) updateData.tags = tags;
        if (rating !== undefined) updateData.rating = rating;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (prepTime !== undefined) updateData.prepTime = prepTime;
        if (cookTime !== undefined) updateData.cookTime = cookTime;
        if (servings !== undefined) updateData.servings = servings;

        // If ingredients are provided, update them
        if (ingredients) {
            // Delete existing recipe ingredients
            await prisma.recipeIngredient.deleteMany({
                where: { recipeId }
            });

            // Create new recipe ingredients
            updateData.recipeIngredients = {
                create: await Promise.all(
                    ingredients.map(async (ing) => {
                        let ingredient = await prisma.ingredient.findUnique({
                            where: { name: ing.name }
                        });

                        if (!ingredient) {
                            ingredient = await prisma.ingredient.create({
                                data: {
                                    name: ing.name,
                                    category: ing.category || 'Other',
                                    unit: ing.unit || 'units'
                                }
                            });
                        }

                        return {
                            ingredientId: ingredient.id,
                            quantity: ing.quantity
                        };
                    })
                )
            };
        }

        const updatedRecipe = await prisma.recipe.update({
            where: { id: recipeId },
            data: updateData,
            include: {
                recipeIngredients: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });

        res.json({
            message: 'Recipe updated successfully',
            recipe: updatedRecipe
        });
    } catch (error) {
        console.error('Update recipe error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
    try {
        const recipeId = parseInt(req.params.id);

        // Check if recipe exists and belongs to user
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId }
        });

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (recipe.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await prisma.recipe.delete({
            where: { id: recipeId }
        });

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
