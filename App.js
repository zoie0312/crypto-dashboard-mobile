import * as React from 'react'
import { useEffect } from 'react'
import RootNavigation from './navigation'
import { NativeBaseProvider } from 'native-base'
import { LinearGradient } from 'expo-linear-gradient'
import { CryptoPriceContextProvider } from './context/CryptoPriceContext'
import { NFTPriceContextProvider } from './context/NFTPriceContext'
import { PortfolioContextProvider } from './context/PortfolioContext'
import { loadCldr } from 'react-native-globalize'
import { PromiseHelperAllSettled } from './app/utils/PromiseHelperAllSettled'
import { store } from './app/store'
import { Provider } from 'react-redux'

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
                        <Provider store={store}>
                            <RootNavigation />
                        </Provider>
                    </PortfolioContextProvider>
                </NFTPriceContextProvider>
            </CryptoPriceContextProvider>
        </NativeBaseProvider>
    )
}
