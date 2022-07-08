import * as React from 'react'
import RootNavigation from './navigation'
import { NativeBaseProvider } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import { CryptoPriceContextProvider } from './context/CryptoPriceContext'

const config = {
    dependencies: {
        'linear-gradient': LinearGradient,
    },
}

export default function App() {
    return (
        <NativeBaseProvider config={config}>
            <CryptoPriceContextProvider>
                <RootNavigation />
            </CryptoPriceContextProvider>
        </NativeBaseProvider>
    )
}
