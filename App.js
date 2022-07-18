import * as React from 'react'
import RootNavigation from './navigation'
import { NativeBaseProvider } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import { CryptoPriceContextProvider } from './context/CryptoPriceContext'
import { PortfolioContextProvider } from './context/PortfolioContext'
import { loadCldr } from 'react-native-globalize';

const config = {
    dependencies: {
        'linear-gradient': LinearGradient,
    },
};

loadCldr(
    require('react-native-globalize/locale-data/en'),
);

export default function App() {
    return (
        <NativeBaseProvider config={config}>
            <CryptoPriceContextProvider>
              <PortfolioContextProvider>
                <RootNavigation />
                </PortfolioContextProvider>
            </CryptoPriceContextProvider>
        </NativeBaseProvider>
    )
}
