const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const recipes = await prisma.recipe.findMany({
        select: {
            title: true,
            imageUrl: true
        }
    });

    console.log('Found ' + recipes.length + ' recipes.');
    recipes.forEach(r => {
        console.log(`Title: ${r.title}`);
        console.log(`Image URL: ${r.imageUrl}`);
        console.log('---');
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
