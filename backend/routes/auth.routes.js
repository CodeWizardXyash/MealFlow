const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Register new user
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').notEmpty().withMessage('Name is required')
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'USER' // Default role
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true
                }
            });

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Server error during registration' });
        }
    }
);

// Login user
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server error during login' });
        }
    }
);

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        recipes: true,
                        favorites: true
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

module.exports = router;
