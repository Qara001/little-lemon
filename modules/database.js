import * as SQLite from "expo-sqlite";

let db;

export const openDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync("little_lemon.db");
    }
    return db;
};

// Initialize Database
export const initializeDatabase = async () => {
    const db = await openDatabase();

    console.log("🛠 Resetting database...");

    // ⚠️ Drop table to remove old data
    await db.runAsync("DROP TABLE IF EXISTS menu;");

    // ✅ Ensure table is created before any queries run
    await db.runAsync(`
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            description TEXT,
            image TEXT,
            category TEXT
        );
    `);

    console.log("✅ Database initialized successfully");
    
    return db; // ✅ Return database instance to signal completion
};




// Fetch menu items from the database
export const fetchMenuFromDB = async () => {
    const db = await openDatabase();
    return await db.getAllAsync("SELECT * FROM menu;");
};

// Insert menu data into the database
export const insertMenuItems = async (menuItems) => {
    const db = await openDatabase();
    await db.runAsync("DELETE FROM menu;"); // Clear old data

    for (const item of menuItems) {
        // ✅ Fix typo: Ensure we use item.category (not itecategory)
        const category = item.category || "Unknown"; 

        await db.runAsync(
            "INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);",
            [item.name, item.price, item.description, item.image, item.category]
        );
    }
    console.log("✅ Menu items inserted successfully");
};


// Filter menu items by selected categories
export const filterMenuByCategories = async (categories, searchQuery = "") => {
    const db = await openDatabase();

    const tables = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='menu';");
    if (tables.length === 0) {
        console.log("⚠️ Menu table does not exist yet, skipping filtering.");
        return [];
    }

    let query = "SELECT * FROM menu";
    let queryParams = [];

    if (categories.length > 0) {
        const placeholders = categories.map(() => "?").join(", ");
        query += ` WHERE category IN (${placeholders})`;
        queryParams = [...categories];
    }

    if (searchQuery.trim()) {
        if (categories.length > 0) {
            query += " AND";
        } else {
            query += " WHERE";
        }
        query += " name LIKE ?";
        queryParams.push(`%${searchQuery}%`);
    }

    return await db.getAllAsync(query, queryParams);
};

