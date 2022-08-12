import { Divider, ScrollView } from "native-base";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import BottomTabs from "../common/components/home/BottomTabs";
import Header from "../common/components/home/Header";
import MainSection from "../features/portfolio/MainSection";
import WalletSection from "../features/portfolio/WalletSection";
//import {walletData} from '../DummyData'

export default function Home({ navigation }) {
    const wallets = useSelector((state) => state.portfolio.wallets);
    // const walletAddresses = wallets.map((wallet) => ({
    //     address: wallet.address,
    //     chain: wallet.chain,
    // }));
    //console.log('Home: wallet addresses= ', walletAddresses);

    return (
        <SafeAreaView backgroundColor="#e6f7ff" flex={1}>
            <View>
                <Header navigation={navigation} />
            </View>
            <MainSection />

            <ScrollView showsVerticalScrollIndicator={false}>
                {wallets.map((wallet) => (
                    <WalletSection
                        key={wallet.address}
                        address={wallet.address}
                        chain={wallet.chain}
                    />
                ))}
            </ScrollView>
            <Divider width={1} />
            <BottomTabs navigation={navigation} />
        </SafeAreaView>
    );
}
