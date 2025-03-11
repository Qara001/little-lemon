import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image, TextInput, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ userData, handleLogout }) {

    const [image, setImage] = useState(null);

    const [checkedOrder, setCheckedOrder] = useState(false);
    const [checkedPassword, setCheckedPassword] = useState(false);
    const [checkedOffers, setCheckedOffers] = useState(false);
    const [checkedNewsletter, setCheckedNewsletter] = useState(false);

    const [firstName, setFirstName] = useState(userData?.name || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [lastName, setLastName] = useState("");
    const [phoneN, setPhoneN] = useState("");

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const storedImage = await AsyncStorage.getItem("profileImage");
            const storedFirstName = await AsyncStorage.getItem("firstName");
            const storedLastName = await AsyncStorage.getItem("lastName");
            const storedEmail = await AsyncStorage.getItem("email");
            const storedPhoneN = await AsyncStorage.getItem("phoneN");
            const storedCheckedOrder = await AsyncStorage.getItem("checkedOrder");
            const storedCheckedPassword = await AsyncStorage.getItem("checkedPassword");
            const storedCheckedOffers = await AsyncStorage.getItem("checkedOffers");
            const storedCheckedNewsletter = await AsyncStorage.getItem("checkedNewsletter");

            if (storedImage) setImage(storedImage);
            if (storedFirstName) setFirstName(storedFirstName);
            if (storedLastName) setLastName(storedLastName);
            if (storedEmail) setEmail(storedEmail);
            if (storedPhoneN) setPhoneN(storedPhoneN);
            setCheckedOrder(storedCheckedOrder === "true");
            setCheckedPassword(storedCheckedPassword === "true");
            setCheckedOffers(storedCheckedOffers === "true");
            setCheckedNewsletter(storedCheckedNewsletter === "true");
        } catch (error) {
            console.error("Failed to load profile data", error);
        }
    };

    // Save data to AsyncStorage
    const saveChanges = async () => {
        try {
            await AsyncStorage.setItem("profileImage", image || "");
            await AsyncStorage.setItem("firstName", firstName);
            await AsyncStorage.setItem("lastName", lastName);
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("phoneN", phoneN);
            await AsyncStorage.setItem("checkedOrder", JSON.stringify(checkedOrder));
            await AsyncStorage.setItem("checkedPassword", JSON.stringify(checkedPassword));
            await AsyncStorage.setItem("checkedOffers", JSON.stringify(checkedOffers));
            await AsyncStorage.setItem("checkedNewsletter", JSON.stringify(checkedNewsletter));

            Alert.alert("Success", "Your changes have been saved!");
        } catch (error) {
            console.error("Failed to save profile data", error);
            Alert.alert("Error", "Could not save your changes.");
        }
    };

    // Reset values to their last saved state
    const discardChanges = async () => {
        await loadProfileData();
        Alert.alert("Changes Discarded", "Reverted to last saved settings.");
    };


    const pickImage = async () => {
        // Request permission to access the image library (only needed on some devices)
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access gallery is required!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.persoInf}>Personnal Information</Text>


            <Text style={styles.basicText2}>Avatar</Text>
            <View style={styles.imagesRow}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.avatar} />
                ) : (
                    <Text style={styles.blank}>
                        {firstName ? firstName.charAt(0).toUpperCase() : ""}
                        {lastName ? lastName.charAt(0).toUpperCase() : ""}
                    </Text>
                )}
                <Pressable style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Change</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => setImage(null)}>
                    <Text style={styles.buttonText}>Remove</Text>
                </Pressable>
            </View>


            <View>
                <Text style={styles.basicText}>First Name</Text>
                <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    keyboardType="default"></TextInput>


                <Text style={styles.basicText}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    keyboardType="default"></TextInput>


                <Text style={styles.basicText}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"></TextInput>


                <Text style={styles.basicText}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={phoneN}
                    onChangeText={setPhoneN}
                    keyboardType="phone-pad"></TextInput>


                <Text style={styles.basicText3}>Email Notification</Text>
            </View>

            <View style={{ marginLeft: 8, marginTop: 4 }}>
                <View style={styles.imagesRow2}>
                    <Pressable style={[styles.checkbox, checkedOrder && styles.checked]}
                        onPress={() => setCheckedOrder(!checkedOrder)}
                        hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                        {checkedOrder && <Text style={styles.checkmark}>✔</Text>}
                    </Pressable>
                    <Text>Order Statuses</Text>
                </View>

                <View style={styles.imagesRow2}>
                    <Pressable style={[styles.checkbox, checkedPassword && styles.checked]}
                        onPress={() => setCheckedPassword(!checkedPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                        {checkedPassword && <Text style={styles.checkmark}>✔</Text>}
                    </Pressable>
                    <Text>Password Changes</Text>
                </View>

                <View style={styles.imagesRow2}>
                    <Pressable style={[styles.checkbox, checkedOffers && styles.checked]}
                        onPress={() => setCheckedOffers(!checkedOffers)}
                        hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                        {checkedOffers && <Text style={styles.checkmark}>✔</Text>}
                    </Pressable>
                    <Text>Special Offers</Text>
                </View>

                <View style={styles.imagesRow2}>
                    <Pressable style={[styles.checkbox, checkedNewsletter && styles.checked]}
                        onPress={() => setCheckedNewsletter(!checkedNewsletter)}
                        hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                    >
                        {checkedNewsletter && <Text style={styles.checkmark}>✔</Text>}
                    </Pressable>
                    <Text>Newsletter</Text>
                </View>

            </View>



            <View style={[styles.imagesRow, { alignSelf: 'center' }]}>
                <Pressable style={styles.buttonstyle2} onPress={saveChanges}><Text>Save Changes</Text></Pressable>
                <Pressable style={styles.buttonstyle2} onPress={discardChanges}><Text>Discard Changes</Text></Pressable>
                <Pressable style={styles.buttonstyle2} onPress={handleLogout}><Text>Logout</Text></Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    persoInf: {
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 15
    },
    basicText: {
        fontSize: 15,
        color: 'gray',
        marginLeft: 4
    },
    basicText2: {
        fontSize: 18,
        color: 'gray',
        marginLeft: 10,
        marginBottom: 5
    },
    basicText3: {
        color: 'gray',
        fontSize: 22,
        marginLeft: 5,
        marginBottom: 5,
        fontWeight: '400'
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 100,
        marginLeft: 5
    },
    blank: {
        borderRadius: 100,
        borderWidth: 1,
        width: 110,
        height: 110,
        marginLeft: 5,
        color: "black",
        textAlign: "center", //  Ensures text inside <Text> is centered
        lineHeight: 110, //  Makes text vertically centered (same as height)
        fontSize: 30,
        backgroundColor: "#ddd" // Optional: Light gray background for visibility
    },
    imagesRow: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: 'center',
        gap: 20
    },
    imagesRow2: {
        flexDirection: "row",
        marginBottom: 20,
        alignItems: 'center',
        gap: 20
    },
    input: {
        borderWidth: 0.2,
        borderRadius: 10,
        marginHorizontal: 4,
        marginBottom: 10
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#555",
        alignItems: "center",
        justifyContent: "center",
    },
    checked: {
        backgroundColor: "#007BFF",
    },
    checkmark: {
        color: "#fff",
        fontSize: 16,
    },
    buttonstyle: {
        width: 160,
        alignSelf: 'center',
        marginTop: -10
    },
    buttonstyle2: {
        backgroundColor: 'lightgray',
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginTop: 10,
    }

}) 