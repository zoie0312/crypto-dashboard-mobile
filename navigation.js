import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from './screens/Home'
import RestaurantDetail from './screens/RestaurantDetail'
import Setting from './screens/Setting'
import { Provider as ReduxProvider } from 'react-redux'
import configureStore from './redux/store'
import OrderCompleted from './screens/OrderCompleted'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GlobalizeProvider } from 'react-native-globalize'

const store = configureStore()

export default function RootNavigation() {
    const Stack = createStackNavigator()

    const screenOptions = {
        headerShown: false,
    }

    return (
        <ReduxProvider store={store}>
            <GlobalizeProvider locale="en" currency="USD">
                <SafeAreaProvider>
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName="Setting"
                            screenOptions={screenOptions}
                        >
                            <Stack.Screen name="Home" component={Home} />
                            <Stack.Screen
                                name="RestaurantDetail"
                                component={RestaurantDetail}
                            />
                            <Stack.Screen name="Setting" component={Setting} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaProvider>
            </GlobalizeProvider>
        </ReduxProvider>
    )
}
