const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Ensure user can only access their own profile
        if (userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        recipes: true,
                        favorites: true,
                        weeklyPlans: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put(
    '/:id',
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Please provide a valid email')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userId = parseInt(req.params.id);

            // Ensure user can only update their own profile
            if (userId !== req.user.userId) {
                return res.status(403).json({ error: 'Access denied' });
            }

            const { name, email } = req.body;
            const updateData = {};

            if (name) updateData.name = name;
            if (email) updateData.email = email;

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    updatedAt: true
                }
            });

            res.json({
                message: 'Profile updated successfully',
                user: updatedUser
            });
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Email already in use' });
            }
            console.error('Update user error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

module.exports = router;
