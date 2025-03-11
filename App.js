import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Profile from "./modules/profile";
import LoginMenu from "./modules/login";
import Header from "./modules/header";
import Home from "./modules/home";

const Stack = createNativeStackNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user_data");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  const handleLogin = async (user) => {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(user));
      setUserData(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user_data");
      setUserData(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  const ProfileScreen = (props) => (
    <Profile {...props} userData={userData} handleLogout={handleLogout} />
  );
  const LoginScreen = (props) => (
    <LoginMenu {...props} userData={userData} handleLogin={handleLogin} />
  );


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
        <Header />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </>
            ) : (
              <Stack.Screen name="LoginMenu" component={LoginScreen}/>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
