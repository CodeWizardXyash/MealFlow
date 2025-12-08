# MealFlow - Recipe & Meal Planning Platform

A full-stack web application that allows users to create, organize, and manage recipes while planning weekly meals through an interactive drag-and-drop calendar interface. The platform automatically generates de-duplicated grocery lists from aggregated recipe data.

## 🚀 Features

### Frontend (React.js)
- **Multi-page routing**: Home, Recipes, Recipe Builder, Weekly Planner, Grocery List, Favorites, User Profile
- **Drag-and-drop weekly planner** with real-time updates
- **Dynamic data fetching** for recipes, ingredients, meal plans, and grocery lists
- **Search, filter, and sort** recipes by tags, ingredients, title, or rating
- **Responsive UI** using React + Tailwind CSS

### Backend (Node.js + Express.js)
- **JWT-based authentication** with secure route protection
- **CRUD Operations**:
  - Users: create, read, update
  - Recipes: full CRUD with ingredients and instructions
  - Ingredients: nested creation via recipes
  - Meal plans: create, update, and retrieve weekly plans
  - Grocery List: auto-generate aggregated ingredient list
- **Advanced filtering, searching, and sorting** via API
- RESTful API architecture

### Database (PostgreSQL + Prisma ORM)
- **Relational tables**: Users, Recipes, Ingredients, RecipeIngredients, WeeklyPlans, PlannerEntries, Favorites
- **Many-to-many relationships** for recipes ↔ ingredients
- **Indexed queries** for fast filtering and lookups

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Axios, React Beautiful DnD
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT, bcrypt
- **Deployment**: Frontend – Vercel, Backend – Render/Railway
- **Version Control**: Git + GitHub

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd capstone\ 3
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/mealflow?schema=public"
# JWT_SECRET="your-secret-key"
# PORT=5000

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database (optional - adds sample data)
npm run prisma:seed

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file if needed
# VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
capstone 3/
├── backend/
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── recipe.routes.js
│   │   ├── planner.routes.js
│   │   ├── grocery.routes.js
│   │   └── favorites.routes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Recipes.jsx
│   │   │   ├── RecipeBuilder.jsx
│   │   │   ├── WeeklyPlanner.jsx
│   │   │   ├── GroceryList.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/:id` - Get user profile (protected)
- `PUT /api/users/:id` - Update user profile (protected)

### Recipes
- `GET /api/recipes` - Get all recipes with filters (protected)
- `GET /api/recipes/:id` - Get single recipe (protected)
- `POST /api/recipes` - Create recipe (protected)
- `PUT /api/recipes/:id` - Update recipe (protected)
- `DELETE /api/recipes/:id` - Delete recipe (protected)

### Weekly Planner
- `GET /api/planner/weekly/:userId` - Get weekly meal plan (protected)
- `POST /api/planner/entry` - Add recipe to planner (protected)
- `PUT /api/planner/entry/:id` - Update planner entry (protected)
- `DELETE /api/planner/entry/:id` - Remove from planner (protected)

### Grocery List
- `GET /api/grocery/:userId` - Generate grocery list (protected)

### Favorites
- `GET /api/favorites/:userId` - Get user favorites (protected)
- `POST /api/favorites` - Add to favorites (protected)
- `DELETE /api/favorites/:id` - Remove from favorites (protected)

## 🎨 Key Features Explained

### Drag-and-Drop Weekly Planner
The weekly planner uses `react-beautiful-dnd` to provide an intuitive drag-and-drop interface. Users can:
- Drag recipes from the sidebar into specific days and meal slots
- Move recipes between different days/meals
- Remove recipes from the planner
- View all planned meals for the week at a glance

### Smart Grocery List Generation
The grocery list feature:
- Automatically aggregates ingredients from all recipes in the weekly plan
- De-duplicates ingredients (e.g., combines "2 cups flour" + "1 cup flour" = "3 cups flour")
- Groups ingredients by category for easier shopping
- Provides a printable format

### Recipe Search & Filtering
Users can find recipes using:
- Text search (searches title and description)
- Tag filtering (Breakfast, Lunch, Dinner, etc.)
- Sorting options (newest, highest rated, alphabetical)
- Pagination for large recipe collections

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Build command: `npm install && npm run prisma:generate`
5. Start command: `npm start`

### Frontend Deployment (Vercel)

1. Import your GitHub repository
2. Framework preset: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variable: `VITE_API_URL=<your-backend-url>/api`

### Database Deployment

Use a managed PostgreSQL service:
- **Supabase** (recommended for beginners)
- **Railway**
- **Render PostgreSQL**
- **AWS RDS**

## 👤 Default Demo User

After running the seed script, you can login with:
- **Email**: demo@mealflow.com
- **Password**: demo123

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
# MealFlow
