import { LinearGradient } from "expo-linear-gradient";
import { NativeBaseProvider } from "native-base";
import * as React from "react";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { loadCldr } from "react-native-globalize";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "./app/store";
import { PromiseHelperAllSettled } from "./app/utils/PromiseHelperAllSettled";
import { CryptoPriceContextProvider } from "./context/CryptoPriceContext";
import { NFTPriceContextProvider } from "./context/NFTPriceContext";
import { PortfolioContextProvider } from "./context/PortfolioContext";
import RootNavigation from "./navigation";

const config = {
    dependencies: {
        "linear-gradient": LinearGradient,
    },
};

loadCldr(require("react-native-globalize/locale-data/en"));

export default function App() {
    useEffect(() => {
        if (Promise && !Promise.allSettled) {
            Promise.allSettled = PromiseHelperAllSettled;
        }
    }, []);

    return (
        <NativeBaseProvider config={config}>
            <CryptoPriceContextProvider>
                <NFTPriceContextProvider>
                    <PortfolioContextProvider>
                        <ReduxProvider store={store}>
                            <SafeAreaProvider>
                                <RootNavigation />
                            </SafeAreaProvider>
                        </ReduxProvider>
                    </PortfolioContextProvider>
                </NFTPriceContextProvider>
            </CryptoPriceContextProvider>
        </NativeBaseProvider>
    );
}
