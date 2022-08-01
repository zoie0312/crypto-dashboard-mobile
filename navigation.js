import React from "react";
import { useDispatch } from 'react-redux'
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from './screens/Home'
import Setting from './screens/Setting'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GlobalizeProvider } from 'react-native-globalize'
import { api } from './app/services/api'


export default function RootNavigation() {
    const dispatch = useDispatch();
    dispatch(api.endpoints.getCryptoPrices.initiate());
    const Stack = createStackNavigator()

    const screenOptions = {
        headerShown: false,
    }

    return (
            <GlobalizeProvider locale="en" currency="USD">
                <SafeAreaProvider>
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName="Setting"
                            screenOptions={screenOptions}
                        >
                            <Stack.Screen name="Home" component={Home} />
                            <Stack.Screen name="Setting" component={Setting} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaProvider>
            </GlobalizeProvider>
    )
}
