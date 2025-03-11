import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView } from "react-native";

export default function LoginMenu({ handleLogin }) {
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const validateInput = () => {
        let isValid = true;

        if (text.trim() === "") {
            setErrorMessage('First name cannot be empty and must be at least 3 letters');
            isValid = false;
        } else if (text.trim().length < 3) {
            setErrorMessage("First name must be at least 3 letters");
        } else {
            setErrorMessage('')
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setEmailErrorMessage('Enter a valid mail address');
            isValid = false;
        } else {
            setEmailErrorMessage('');
        }

        return isValid;
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="none">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Text style={{ marginTop: 70, fontSize: 30 }}>
                        Let us get to know you
                    </Text>
                    <Text style={{ marginTop: 190, fontSize: 20 }}>
                        First Name
                    </Text>
                    <TextInput
                        onChangeText={setText}
                        value={text}
                        placeholder="Enter your first name"
                        style={styles.textInput}
                    />
                    {errorMessage ? <Text style={styles.errorMessageColor}>{errorMessage}</Text> : null}

                    <Text style={{ marginTop: 70, fontSize: 20 }}>
                        Email
                    </Text>
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Enter your email"
                        style={styles.textInput2}
                        keyboardType="email-address"
                    />
                    {emailErrorMessage ? <Text style={styles.errorMessageColor}>{emailErrorMessage}</Text> : null}
                </View>
                <View style={styles.bottom}>
                    <Pressable style={styles.nextButton}
                        onPress={() => {
                            if (validateInput()) {
                                const user = { name: text, email: email };
                                handleLogin(user); // Store data in AsyncStorage
                            }
                        }}>
                        <Text>Next</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#cccccc',
        alignItems: 'center',
        flex: 1
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 5,
        padding: 10,
        width: "80%",
        backgroundColor: "#fff",
        fontSize: 16,
        marginTop: 10
    },
    textInput2: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 5,
        padding: 10,
        width: "80%",
        backgroundColor: "#fff",
        fontSize: 16,
        marginTop: 10,
        marginBottom : 70
    },
    bottom: {
        backgroundColor: '#ededed',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingVertical: 25
    },
    nextButton: {
        borderWidth: 1,
        paddingHorizontal: 42,
        paddingVertical: 18,
        marginLeft: 170
    },
    errorMessageColor: {
        color: 'red',
        marginTop: 5
    }
})