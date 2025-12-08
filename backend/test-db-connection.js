const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const userCount = await prisma.user.count();
        console.log(`Database connected. User count: ${userCount}`);

        // Check if test user exists
        const testUser = await prisma.user.findFirst({
            where: { email: 'test@example.com' }
        });

        if (testUser) {
            console.log('Test user exists:', testUser.email);
        } else {
            console.log('Test user not found');
        }

    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
