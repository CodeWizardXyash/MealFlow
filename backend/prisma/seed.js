const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seed...');

    // Create sample ingredients
    const ingredients = await Promise.all([
        prisma.ingredient.upsert({
            where: { name: 'Chicken Breast' },
            update: {},
            create: { name: 'Chicken Breast', category: 'Meat', unit: 'grams' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Tomato' },
            update: {},
            create: { name: 'Tomato', category: 'Vegetables', unit: 'pieces' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Onion' },
            update: {},
            create: { name: 'Onion', category: 'Vegetables', unit: 'pieces' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Garlic' },
            update: {},
            create: { name: 'Garlic', category: 'Vegetables', unit: 'cloves' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Olive Oil' },
            update: {},
            create: { name: 'Olive Oil', category: 'Oils', unit: 'tablespoons' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Rice' },
            update: {},
            create: { name: 'Rice', category: 'Grains', unit: 'cups' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Milk' },
            update: {},
            create: { name: 'Milk', category: 'Dairy', unit: 'cups' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Eggs' },
            update: {},
            create: { name: 'Eggs', category: 'Dairy', unit: 'pieces' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Salt' },
            update: {},
            create: { name: 'Salt', category: 'Spices', unit: 'teaspoons' }
        }),
        prisma.ingredient.upsert({
            where: { name: 'Black Pepper' },
            update: {},
            create: { name: 'Black Pepper', category: 'Spices', unit: 'teaspoons' }
        })
    ]);

    console.log(`Created ${ingredients.length} ingredients`);

    // Create a demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@mealflow.com' },
        update: { role: 'USER' },
        create: {
            email: 'demo@mealflow.com',
            password: hashedPassword,
            name: 'Demo User',
            role: 'USER'
        }
    });

    console.log('Created demo user:', demoUser.email);

    // Create an admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@mealflow.com' },
        update: { role: 'ADMIN' },
        create: {
            email: 'admin@mealflow.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN'
        }
    });

    console.log('Created admin user:', adminUser.email);

    // Create sample recipes
    // Create sample recipes
    const recipes = [
        {
            title: 'Classic Grilled Chicken Salad',
            description: 'A healthy and delicious grilled chicken salad with fresh vegetables and a light vinaigrette.',
            instructions: [
                'Season chicken breasts with salt, pepper, and olive oil.',
                'Grill chicken for 6-8 minutes per side until fully cooked.',
                'Chop lettuce, tomatoes, cucumbers, and onions.',
                'Slice the grilled chicken.',
                'Toss vegetables and chicken in a large bowl.',
                'Drizzle with vinaigrette and serve.'
            ],
            tags: ['Healthy', 'Salad', 'Dinner', 'Low Carb'],
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 20,
            cookTime: 15,
            servings: 2,
            ingredients: [
                { name: 'Chicken Breast', quantity: 2 },
                { name: 'Tomato', quantity: 2 },
                { name: 'Onion', quantity: 1 },
                { name: 'Olive Oil', quantity: 2 },
                { name: 'Salt', quantity: 1 },
                { name: 'Black Pepper', quantity: 1 }
            ]
        },
        {
            title: 'Creamy Tomato Pasta',
            description: 'Simple and comforting pasta dish with a rich tomato cream sauce.',
            instructions: [
                'Boil pasta in salted water until al dente.',
                'In a pan, sauté garlic and onions in olive oil.',
                'Add crushed tomatoes and simmer for 10 minutes.',
                'Stir in heavy cream and parmesan cheese.',
                'Toss pasta with the sauce.',
                'Garnish with fresh basil.'
            ],
            tags: ['Pasta', 'Italian', 'Vegetarian', 'Comfort Food'],
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            ingredients: [
                { name: 'Tomato', quantity: 4 },
                { name: 'Onion', quantity: 1 },
                { name: 'Garlic', quantity: 3 },
                { name: 'Olive Oil', quantity: 2 },
                { name: 'Salt', quantity: 1 }
            ]
        },
        {
            title: 'Garlic Butter Rice',
            description: 'A flavorful side dish that pairs well with almost anything.',
            instructions: [
                'Rinse rice thoroughly.',
                'Sauté garlic in butter until fragrant.',
                'Add rice and toast for 2 minutes.',
                'Add water and bring to a boil.',
                'Reduce heat, cover, and simmer for 18 minutes.',
                'Fluff with a fork and serve.'
            ],
            tags: ['Side Dish', 'Rice', 'Easy'],
            rating: 4.2,
            imageUrl: 'https://images.unsplash.com/photo-1516684732162-79880062f549?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 5,
            cookTime: 25,
            servings: 4,
            ingredients: [
                { name: 'Rice', quantity: 2 },
                { name: 'Garlic', quantity: 4 },
                { name: 'Salt', quantity: 1 },
                { name: 'Olive Oil', quantity: 1 }
            ]
        },
        {
            title: 'Avocado Toast with Egg',
            description: 'The creating breakfast staple - crispy toast, creamy avocado, and a perfect fried egg.',
            instructions: [
                'Toast bread slices until golden brown.',
                'Mash avocado with salt, pepper, and lemon juice.',
                'Fry eggs sunny side up in a small pan.',
                'Spread avocado mash onto toast.',
                'Top with fried egg and sprinkle with chili flakes.'
            ],
            tags: ['Breakfast', 'Quick', 'Healthy', 'Vegetarian'],
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 10,
            cookTime: 5,
            servings: 1,
            ingredients: [
                { name: 'Bread', quantity: 2 },
                { name: 'Avocado', quantity: 1 },
                { name: 'Eggs', quantity: 2 },
                { name: 'Salt', quantity: 1 },
                { name: 'Black Pepper', quantity: 1 }
            ]
        },
        {
            title: 'Beef Stir Fry',
            description: 'Quick and savory beef stir fry with crispy vegetables.',
            instructions: [
                'Slice beef into thin strips.',
                'Stir fry beef in hot oil for 2-3 minutes, then remove.',
                'Sauté mixed vegetables (broccoli, carrots, peppers).',
                'Add beef back in with soy sauce and ginger.',
                'Toss well and serve over rice.'
            ],
            tags: ['Dinner', 'Asian', 'High Protein', 'Quick'],
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 15,
            cookTime: 10,
            servings: 3,
            ingredients: [
                { name: 'Beef', quantity: 1 },
                { name: 'Broccoli', quantity: 1 },
                { name: 'Carrot', quantity: 2 },
                { name: 'Soy Sauce', quantity: 2 },
                { name: 'Rice', quantity: 2 }
            ]
        },
        {
            title: 'Blueberry Pancakes',
            description: 'Fluffy buttermilk pancakes filled with bursting fresh blueberries.',
            instructions: [
                'Mix flour, sugar, baking powder, and salt.',
                'Whisk milk, egg, and melted butter.',
                'Combine wet and dry ingredients, leave lumps.',
                'Fold in blueberries gently.',
                'Cook on griddle until bubbles form, then flip.',
                'Serve hot with maple syrup.'
            ],
            tags: ['Breakfast', 'Sweet', 'Vegetarian'],
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 15,
            cookTime: 15,
            servings: 4,
            ingredients: [
                { name: 'Flour', quantity: 2 },
                { name: 'Milk', quantity: 1 },
                { name: 'Eggs', quantity: 2 },
                { name: 'Blueberries', quantity: 1 },
                { name: 'Butter', quantity: 2 }
            ]
        },
        {
            title: 'Vegetable Curry',
            description: 'Warm and spicy coconut vegetable curry.',
            instructions: [
                'Sauté onions, garlic, and ginger.',
                'Add curry paste and cook for 1 minute.',
                'Add coconut milk and bring to simmer.',
                'Add potatoes, carrots, and cauliflower.',
                'Simmer until veggies are tender.',
                'Serve with rice or naan.'
            ],
            tags: ['Vegan', 'Dinner', 'Spicy', 'Curry'],
            rating: 4.4,
            imageUrl: 'https://images.unsplash.com/photo-1627907228175-2bf841a303b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 20,
            cookTime: 30,
            servings: 4,
            ingredients: [
                { name: 'Coconut Milk', quantity: 1 },
                { name: 'Potato', quantity: 3 },
                { name: 'Carrot', quantity: 2 },
                { name: 'Onion', quantity: 1 },
                { name: 'Garlic', quantity: 2 }
            ]
        },
        {
            title: 'Chocolate Chip Cookies',
            description: 'Chewy cookies with crisp edges and gooey chocolate centers.',
            instructions: [
                'Cream butter and sugars together.',
                'Beat in egg and vanilla.',
                'Mix in flour and baking soda.',
                'Stir in chocolate chips.',
                'Chill dough for 30 minutes.',
                'Bake at 350°F (175°C) for 10-12 minutes.'
            ],
            tags: ['Dessert', 'Baking', 'Sweet', 'Snack'],
            rating: 5.0,
            imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee9155bb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 15,
            cookTime: 12,
            servings: 12,
            ingredients: [
                { name: 'Butter', quantity: 1 },
                { name: 'Flour', quantity: 2 },
                { name: 'Chocolate Chips', quantity: 1 },
                { name: 'Sugar', quantity: 1 },
                { name: 'Eggs', quantity: 1 }
            ]
        },
        {
            title: 'Greek Salad',
            description: 'Fresh and tangy salad with feta, olives, and crisp veggies.',
            instructions: [
                'Chop cucumber, tomatoes, and red onion.',
                'Combine in a bowl with Kalamata olives.',
                'Add large blocks of feta cheese.',
                'Drizzle generously with olive oil and oregano.',
                'Serve immediately.'
            ],
            tags: ['Salad', 'Mediterranean', 'Vegetarian', 'Healthy'],
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 15,
            cookTime: 0,
            servings: 2,
            ingredients: [
                { name: 'Tomato', quantity: 3 },
                { name: 'Cucumber', quantity: 1 },
                { name: 'Feta Cheese', quantity: 1 },
                { name: 'Olive Oil', quantity: 2 },
                { name: 'Onion', quantity: 1 }
            ]
        },
        {
            title: 'Fruit Smoothies Bowl',
            description: 'Refreshing smoothie bowl topped with granola and fresh fruits.',
            instructions: [
                'Blend frozen bananas and berries with little milk.',
                'Pour into a bowl.',
                'Top with granola, sliced banana, and seeds.',
                'Drizzle with honey.'
            ],
            tags: ['Breakfast', 'Healthy', 'Vegan', 'Quick'],
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1626078436812-e75c92330bf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 10,
            cookTime: 0,
            servings: 1,
            ingredients: [
                { name: 'Banana', quantity: 2 },
                { name: 'Berries', quantity: 1 },
                { name: 'Granola', quantity: 1 },
                { name: 'Honey', quantity: 1 }
            ]
        },
        {
            title: 'Sushi Roll Platter',
            description: 'Fresh homemade sushi rolls with salmon, avocado, and cucumber.',
            instructions: [
                'Cook sushi rice and season with vinegar.',
                'Place nori sheet on bamboo mat.',
                'Spread rice evenly.',
                'Add salmon, avocado, and cucumber strips.',
                'Roll tightly and slice.',
                'Serve with soy sauce and wasabi.'
            ],
            tags: ['Dinner', 'Japanese', 'Fish', 'Healthy'],
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 40,
            cookTime: 20,
            servings: 2,
            ingredients: [
                { name: 'Rice', quantity: 2 },
                { name: 'Salmon', quantity: 1 },
                { name: 'Avocado', quantity: 1 },
                { name: 'Cucumber', quantity: 1 },
                { name: 'Soy Sauce', quantity: 1 }
            ]
        },
        {
            title: 'Classic Cheeseburger',
            description: 'Juicy beef patty with melted cheddar, fresh lettuce, and tomato.',
            instructions: [
                'Form ground beef into patties.',
                'Season with salt and pepper.',
                'Grill patties for 4 minutes per side.',
                'Add cheese slice in the last minute.',
                'Toast buns.',
                'Assemble with lettuce, tomato, and sauce.'
            ],
            tags: ['Dinner', 'American', 'Comfort Food', 'Beef'],
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 15,
            cookTime: 10,
            servings: 4,
            ingredients: [
                { name: 'Beef', quantity: 2 },
                { name: 'Cheese', quantity: 4 },
                { name: 'Lettuce', quantity: 1 },
                { name: 'Tomato', quantity: 2 },
                { name: 'Bread', quantity: 4 }
            ]
        },
        {
            title: 'Spicy Chicken Tacos',
            description: 'Soft shell tacos filled with spicy seasoned chicken and salsa.',
            instructions: [
                'Season chicken with taco spice mix.',
                'Cook chicken in a skillet until done.',
                'Warm tortillas.',
                'Fill tortillas with chicken.',
                'Top with salsa, onions, and cilantro.'
            ],
            tags: ['Dinner', 'Mexican', 'Spicy', 'Quick'],
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 15,
            cookTime: 15,
            servings: 3,
            ingredients: [
                { name: 'Chicken Breast', quantity: 2 },
                { name: 'Onion', quantity: 1 },
                { name: 'Tomato', quantity: 2 },
                { name: 'Garlic', quantity: 2 },
                { name: 'Salt', quantity: 1 }
            ]
        },
        {
            title: 'Miso Ramen',
            description: 'Rich miso broth with noodles, egg, and green onions.',
            instructions: [
                'Boil broth with miso paste.',
                'Cook noodles separately.',
                'Soft boil eggs.',
                'Combine noodles and broth.',
                'Top with egg and green onions.'
            ],
            tags: ['Lunch', 'Japanese', 'Soup', 'Comfort Food'],
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 10,
            cookTime: 20,
            servings: 2,
            ingredients: [
                { name: 'Eggs', quantity: 2 },
                { name: 'Onion', quantity: 1 },
                { name: 'Garlic', quantity: 1 },
                { name: 'Salt', quantity: 1 },
                { name: 'Chicken Breast', quantity: 1 }
            ]
        },
        {
            title: 'Grilled Ribeye Steak',
            description: 'Perfectly seared ribeye steak with garlic butter and herbs.',
            instructions: [
                'Season steak generously with salt and pepper.',
                'Sear in hot pan with butter and garlic.',
                'Baste with butter continually.',
                'Rest for 5 minutes before slicing.'
            ],
            tags: ['Dinner', 'Meat', 'Keto', 'Premium'],
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 5,
            cookTime: 15,
            servings: 2,
            ingredients: [
                { name: 'Beef', quantity: 2 },
                { name: 'Butter', quantity: 2 },
                { name: 'Garlic', quantity: 4 },
                { name: 'Salt', quantity: 1 },
                { name: 'Black Pepper', quantity: 1 }
            ]
        },
        {
            title: 'Strawberry Cheesecake',
            description: 'Creamy no-bake cheesecake topped with fresh strawberry glaze.',
            instructions: [
                'Crush biscuits and mix with melted butter for base.',
                'Mix cream cheese and sugar.',
                'Pour over base and chill.',
                'Top with strawberries.',
                'Refrigerate for 4 hours.'
            ],
            tags: ['Dessert', 'Sweet', 'Baking', 'Vegetarian'],
            rating: 5.0,
            imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 30,
            cookTime: 0,
            servings: 8,
            ingredients: [
                { name: 'Butter', quantity: 1 },
                { name: 'Sugar', quantity: 2 },
                { name: 'Berries', quantity: 2 },
                { name: 'Cheese', quantity: 2 },
                { name: 'Milk', quantity: 1 }
            ]
        },
        {
            title: 'Bean & Rice Burrito',
            description: 'Hearty burrito filled with seasoned beans, rice, and cheese.',
            instructions: [
                'Cook rice with lime and cilantro.',
                'Heat beans with spices.',
                'Warm large tortillas.',
                'Layer rice, beans, and cheese.',
                'Roll tightly and grill briefly.'
            ],
            tags: ['Lunch', 'Mexican', 'Vegetarian', 'Quick'],
            rating: 4.3,
            imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 10,
            cookTime: 15,
            servings: 4,
            ingredients: [
                { name: 'Rice', quantity: 2 },
                { name: 'Cheese', quantity: 2 },
                { name: 'Onion', quantity: 1 },
                { name: 'Salt', quantity: 1 },
                { name: 'Garlic', quantity: 1 }
            ]
        },
        {
            title: 'Mushroom Soup',
            description: 'Creamy and earthy mushroom soup with thyme.',
            instructions: [
                'Sauté chopped mushrooms and onions.',
                'Add garlic and cook until fragrant.',
                'Pour in broth and simmer.',
                'Blend half the soup for creaminess.',
                'Stir in cream and thyme.'
            ],
            tags: ['Lunch', 'Soup', 'Vegetarian', 'Comfort Food'],
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 15,
            cookTime: 25,
            servings: 4,
            ingredients: [
                { name: 'Onion', quantity: 1 },
                { name: 'Garlic', quantity: 2 },
                { name: 'Butter', quantity: 1 },
                { name: 'Milk', quantity: 1 },
                { name: 'Salt', quantity: 1 }
            ]
        },
        {
            title: 'Baked Salmon with Asparagus',
            description: 'Healthy sheet pan dinner with lemon butter salmon.',
            instructions: [
                'Place salmon and asparagus on baking sheet.',
                'Drizzle with olive oil and lemon juice.',
                'Season with dill, salt, and pepper.',
                'Bake at 400°F for 12-15 minutes.'
            ],
            tags: ['Dinner', 'Healthy', 'Fish', 'Keto'],
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a1b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 10,
            cookTime: 15,
            servings: 2,
            ingredients: [
                { name: 'Salmon', quantity: 2 },
                { name: 'Olive Oil', quantity: 2 },
                { name: 'Salt', quantity: 1 },
                { name: 'Black Pepper', quantity: 1 },
                { name: 'Garlic', quantity: 1 }
            ]
        },
        {
            title: 'Belgian Waffles',
            description: 'Crispy on the outside, fluffy on the inside golden waffles.',
            instructions: [
                'Mix batter ingredients until smooth.',
                'Heat waffle iron.',
                'Pour batter and cook until golden.',
                'Serve with butter and syrup.'
            ],
            tags: ['Breakfast', 'Sweet', 'Vegetarian', 'American'],
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            prepTime: 10,
            cookTime: 15,
            servings: 4,
            ingredients: [
                { name: 'Flour', quantity: 2 },
                { name: 'Eggs', quantity: 2 },
                { name: 'Milk', quantity: 1 },
                { name: 'Butter', quantity: 1 },
                { name: 'Sugar', quantity: 1 }
            ]
        }
    ];

    // Clear existing recipes for demo user to prevent duplicates
    await prisma.recipe.deleteMany({
        where: { userId: demoUser.id }
    });
    console.log('Cleared existing recipes for demo user');

    console.log('Creating recipes...');

    for (const recipe of recipes) {
        const { ingredients, imageUrl, ...recipeData } = recipe;

        // Use real food images
        // We do not encode title for Unsplash, we just used hardcoded URLs in the recipes array if they exist
        // If they don't exist (like for some new ones we might have missed), we fallback to placeholder
        // But for this seed, we will ensure all recipes above have imageUrls.

        // Let's modify the loop to respect the imageUrl key if it exists and is not empty
        let finalImageUrl = recipe.imageUrl;

        if (!finalImageUrl) {
            // Fallback for any without a URL (though we should fill them all)
            const encodedTitle = encodeURIComponent(recipe.title);
            finalImageUrl = `https://placehold.co/800x600/e2e8f0/475569?text=${encodedTitle}`;
        }

        const createdRecipe = await prisma.recipe.create({
            data: {
                ...recipeData,
                imageUrl: finalImageUrl,
                userId: demoUser.id,
                recipeIngredients: {
                    create: await Promise.all(ingredients.map(async (ing) => {
                        // Find the ingredient id
                        const dbIngredient = await prisma.ingredient.findUnique({
                            where: { name: ing.name }
                        });

                        // Fallback if not found (though our seed just created them)
                        if (!dbIngredient) {
                            console.warn(`Ingredient ${ing.name} not found, creating...`);
                            const newIng = await prisma.ingredient.create({
                                data: { name: ing.name, category: 'Other', unit: 'units' }
                            });
                            return {
                                ingredientId: newIng.id,
                                quantity: ing.quantity
                            };
                        }

                        return {
                            ingredientId: dbIngredient.id,
                            quantity: ing.quantity
                        };
                    }))
                }
            }
        });
        console.log(`Created recipe: ${createdRecipe.title}`);
    }

    console.log('Database seed completed!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
