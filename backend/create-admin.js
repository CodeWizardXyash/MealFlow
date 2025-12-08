const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Creating admin user...');

    const adminPassword = await bcrypt.hash('admin123', 10);

    try {
        const adminUser = await prisma.user.upsert({
            where: { email: 'admin@mealflow.com' },
            update: {
                role: 'ADMIN',
                password: adminPassword,
                name: 'Admin User'
            },
            create: {
                email: 'admin@mealflow.com',
                password: adminPassword,
                name: 'Admin User',
                role: 'ADMIN'
            }
        });

        console.log('Successfully created/updated admin user:', adminUser.email);
        console.log('Role:', adminUser.role);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
