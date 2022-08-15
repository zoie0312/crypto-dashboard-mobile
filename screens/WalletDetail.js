import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../app/utils/Constants";
import NFTView from "../features/wallet/NFTView";
import TokenView from "../features/wallet/TokenView";
import WalletHeader from "../features/wallet/WalletHeader";

function WalletDetail({ navigation, route }) {
    const { ownerAddress, chain } = route?.params;
    const Tab = createMaterialTopTabNavigator();
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: Colors.AppBackground }}
        >
            <WalletHeader navigation={navigation} />

            <Tab.Navigator initialRouteName="TokenView">
                <Tab.Screen
                    name="TokenView"
                    component={TokenView}
                    options={{ tabBarLabel: "Token" }}
                    initialParams={{ ownerAddress, chain }}
                />
                <Tab.Screen
                    name="NFTView"
                    component={NFTView}
                    options={{ tabBarLabel: "NFT" }}
                    initialParams={{ ownerAddress, chain }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

export default WalletDetail;
