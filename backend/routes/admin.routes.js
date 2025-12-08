const express = require('express');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get System Stats
router.get('/stats', async (req, res) => {
    try {
        const [userCount, recipeCount, ingredientCount] = await Promise.all([
            prisma.user.count(),
            prisma.recipe.count(),
            prisma.ingredient.count()
        ]);

        res.json({
            users: userCount,
            recipes: recipeCount,
            ingredients: ingredientCount
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { recipes: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ users });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete User
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Prevent deleting self
        if (userId === req.user.userId) {
            return res.status(400).json({ error: 'Cannot delete your own admin account' });
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
