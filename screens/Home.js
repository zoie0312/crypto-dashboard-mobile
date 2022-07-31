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
import { useSelector } from 'react-redux'
//import {walletData} from '../DummyData'

export default function Home({ navigation }) {
    const wallets = useSelector(state => state.portfolio.wallets);
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
                    wallets.map((wallet) => (
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
