const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying admin login...');
    const email = 'admin@mealflow.com';
    const password = 'admin123';

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('❌ User not found:', email);
            return;
        }

        console.log('✅ User found:', { id: user.id, email: user.email, role: user.role, passwordHash: user.password });

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            console.log('✅ Password match! Credentials are correct.');
        } else {
            console.log('❌ Password mismatch!');
        }

    } catch (error) {
        console.error('Error verifying login:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
