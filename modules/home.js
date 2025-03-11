import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { initializeDatabase, fetchMenuFromDB, insertMenuItems, filterMenuByCategories } from "./database"; // ✅ Import database functions
import { debounce } from "lodash";


const categories = ['starters', 'mains', 'desserts', 'drinks', 'speciality'];

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
        }, 500), // ✅ Debounce search by 500ms
        []
    );

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                const db = await initializeDatabase(); // ✅ Wait until DB is ready

                if (db) {
                    console.log("✅ Database is ready, fetching menu...");

                    const result = await fetchMenuFromDB();
                    console.log("🛠 Stored menu data in SQLite:", result);

                    if (result.length > 0) {
                        console.log("✅ Loading menu from database...");
                        setMenu(result);
                        setLoading(false);
                    } else {
                        console.log("⚠️ No menu in database, fetching from API...");
                        await fetchMenuFromAPI(); // ✅ Only fetch if DB is empty
                    }
                }
            } catch (err) {
                console.error("Database error:", err);
                setError("Failed to initialize database");
                setLoading(false);
            }
        };

        setupDatabase();
    }, []);



    useEffect(() => {
        const fetchFilteredMenu = async () => {
            try {
                const filteredMenu = await filterMenuByCategories(selectedCategory, searchQuery);
                setMenu(filteredMenu);
            } catch (err) {
                console.error("Filtering error:", err);
                setError("Failed to filter menu");
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredMenu();
    }, [selectedCategory, searchQuery]); // ✅ No manual debounce needed

    const fetchMenuFromAPI = async () => {
        try {
            console.log("🌐 Fetching menu from API..."); // ✅ Log fetch start

            const response = await fetch("https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json");

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`); // ✅ Handle HTTP errors
            }

            const data = await response.json();
            console.log("✅ API Response:", JSON.stringify(data, null, 2)); // ✅ Log response

            if (!data.menu || !Array.isArray(data.menu)) {
                throw new Error("Invalid menu data format"); // ✅ Handle incorrect structure
            }

            await insertMenuItems(data.menu);
            setMenu(data.menu);
        } catch (err) {
            console.error("❌ API fetch error:", err);
            setError(`Failed to fetch menu data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    const toggleCategory = (category) => {
        setSelectedCategory(prevSelected =>
            prevSelected.includes(category)
                ? prevSelected.filter(c => c !== category)
                : [...prevSelected, category]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.bannerContainer}>
                <View style={styles.topBanner}>
                    <View style={{ padding: 10 }}>
                        <Text style={styles.bannerTitle}>Welcome to Our Restaurant</Text>
                        <Text style={styles.bannerSubtitle}>Find your favorite meals easily!</Text>
                    </View>
                    <Image style={styles.bannerImage} source={{ uri: 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/pasta.jpg', }} />
                </View>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for dishes..."
                    onChangeText={debouncedSearch} // ✅ Debounced input handling
                />
            </View>
            <Text style={styles.title}>Order For Delivery !</Text>

            {/* FIX: Set a fixed height for the ScrollView */}
            <View style={styles.categoryContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.banner}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => toggleCategory(category)}
                            style={[
                                styles.bannerButton,
                                selectedCategory.includes(category) && styles.selectedButton
                            ]}
                        >
                            <Text style={[
                                styles.bannerText,
                                selectedCategory.includes(category) && styles.selectedText
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* FIX: Ensures FlatList has space to render items */}
            <View style={styles.listContainer}>
                <FlatList
                    data={menu}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => {
                        const imageUrl = `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/${item.image}`;

                        return (
                            <View style={styles.item}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.name}</Text>
                                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                                    <Text>{item.description}</Text>
                                </View>
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={styles.image}
                                    onError={() => console.log(`❌ Image failed to load: ${imageUrl}`)}
                                />
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    topBanner: {
        flexDirection: "row", // ✅ Align text and image side by side
        alignItems: "center", // ✅ Keep them centered
        justifyContent: "space-between", // ✅ Spread content evenly
        marginBottom: 10, // Space before search bar
    },
    bannerContainer: {
        width: "100%",
        backgroundColor: "#ffcc00", // Custom banner background color
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        marginBottom: 10,
    },
    bannerImage: {
        height: 100,
        width: 100
    },
    bannerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        width: 200,

    },
    bannerSubtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    searchBar: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
    },
    categoryContainer: {
        height: 50, // ✅ FIX: Limits category button height
        marginBottom: 10,
    },
    banner: {
        flexDirection: 'row',
        alignItems: "center", // ✅ Keeps buttons aligned
        gap: 15, // ✅ Reduced spacing to fit better
    },
    bannerButton: {
        borderWidth: 0.2,
        paddingVertical: 8, // ✅ Reduced padding
        paddingHorizontal: 15,
        borderRadius: 5,
        borderColor: 'black',
        backgroundColor: '#E2DADA',
    },
    listContainer: {
        flex: 1, // ✅ Ensures FlatList has enough space
    },
    item: {
        backgroundColor: "#f8f8f8",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "green",
        marginBottom: 5,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        alignSelf: "center",
    },
    bannerText: {
        color: 'black',
        fontSize: 16,
    },
    selectedButton: {
        backgroundColor: 'lightgray',
    },
    selectedText: {
        color: 'white',
    },
    title: {
        fontSize: 25
    }
});
