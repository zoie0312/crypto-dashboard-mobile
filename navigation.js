import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { GlobalizeProvider } from "react-native-globalize";
import { useDispatch } from "react-redux";

import { api } from "./app/services/api";
import Home from "./screens/Home";
import Setting from "./screens/Setting";

export default function RootNavigation() {
    const dispatch = useDispatch();
    dispatch(api.endpoints.getCryptoPrices.initiate());
    const Stack = createStackNavigator();

    const screenOptions = {
        headerShown: false,
    };

    return (
        <GlobalizeProvider locale="en" currency="USD">
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Setting"
                    screenOptions={screenOptions}
                >
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Setting" component={Setting} />
                </Stack.Navigator>
            </NavigationContainer>
        </GlobalizeProvider>
    );
}
