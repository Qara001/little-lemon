import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Header() {

    const [avatar, setAvatar] = useState(null);
    const navigation = useNavigation();
    const [initials, setInitials] = useState("");


    useEffect(() => {
        const loadAvatar = async () => {
            try {
                const storedImage = await AsyncStorage.getItem("profileImage");
                setAvatar(storedImage);

                const storedFirstName = await AsyncStorage.getItem("firstName");
                const storedLastName = await AsyncStorage.getItem("lastName");

                const firstInitial = storedFirstName ? storedFirstName.charAt(0).toUpperCase() : "";
                const lastInitial = storedLastName ? storedLastName.charAt(0).toUpperCase() : "";

                setInitials(`${firstInitial}${lastInitial}`);

            } catch (error) {
                console.error("Failed to load avatar:", error);
            }
        };

        loadAvatar();

    }, []);

    return (
        <View style={styles.header}>
            <View style={styles.headerImage}>
                <Image style={styles.image} source={require('../assets/images/LittleLemonMainLogo.jpg')} />
            </View>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => navigation.navigate("Profile")}
            >
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <Text style={styles.blank}>{initials}</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '10%',
        backgroundColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerImage: {
        width: '60%',
        height: '95%',
        justifyContent : 'center',
        alignItems: 'center'
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    avatarContainer: {
        position: 'absolute',
        right: 10, 
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 50,
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    blank: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: "#ddd",
        textAlign: "center",
        lineHeight: 40,
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    }
})