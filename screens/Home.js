import React, { useEffect, useState, useContext } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Divider, ScrollView } from 'native-base'
import BottomTabs from '../components/home/BottomTabs'
import Header from '../components/home/Header'
import RestaurantItems, {
    localRestaurants,
} from '../components/home/RestaurantItems'
import MainSection from '../components/home/MainSection'
import NFTSection from '../components/home/NFTSection'
import WalletSection from '../components/home/WalletSection'
import { CryptoPriceContext } from '../context/CryptoPriceContext'
import { PortfolioContext } from '../context/PortfolioContext'
//import {walletData} from '../DummyData'

const YELP_API_KEY =
    'bdRJutLhFAQJ36t7b89CWjHFBU4OKzjt9wvZzcY-nkgmvTqlNMjZWV1eG7iBQ9R74SyfxRg9LWnBAkZY06BtAZAe4d2dfX-2vuX8a1l5V7foctHfX9UKEyoM5ts3YXYx'

export default function Home({ navigation }) {
    //const cryptoPrices = useContext(CryptoPriceContext);
    const { wallets } = useContext(PortfolioContext);
    const walletAddresses = wallets.map(wallet => ({
        address: wallet.address,
        chain: wallet.chain
    }));
    console.log('Home: wallet addresses= ', walletAddresses);

    return (
        <SafeAreaView backgroundColor="#e6f7ff" flex={1}>
            <View>
                <Header navigation={navigation} />
            </View>
            <MainSection />

            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    walletAddresses.map((wallet) => (
                        <WalletSection 
                            key={wallet.address}
                            address={wallet.address}
                            chain={wallet.chain}
                        />
                    ))
                }
            </ScrollView>
            <Divider width={1} />
            <BottomTabs navigation={navigation} />
        </SafeAreaView>
    )
}
