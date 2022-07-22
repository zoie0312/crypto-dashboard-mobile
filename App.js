import * as React from 'react'
import { useEffect } from 'react'
import RootNavigation from './navigation'
import { NativeBaseProvider } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import { CryptoPriceContextProvider } from './context/CryptoPriceContext'
import { NFTPriceContextProvider } from './context/NFTPriceContext'
import { PortfolioContextProvider } from './context/PortfolioContext'
import { loadCldr } from 'react-native-globalize'
import { PromiseHelperAllSettled } from './utils/PromiseHelperAllSettled'

const config = {
    dependencies: {
        'linear-gradient': LinearGradient,
    },
}

loadCldr(require('react-native-globalize/locale-data/en'))

export default function App() {
    useEffect(() => {
        if (Promise && !Promise.allSettled) {
            Promise.allSettled = PromiseHelperAllSettled
        }
    }, [])

    return (
        <NativeBaseProvider config={config}>
            <CryptoPriceContextProvider>
                <NFTPriceContextProvider>
                    <PortfolioContextProvider>
                        <RootNavigation />
                    </PortfolioContextProvider>
                </NFTPriceContextProvider>
            </CryptoPriceContextProvider>
        </NativeBaseProvider>
    )
}
