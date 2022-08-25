import {
    VStack,
    HStack,
    ChevronLeftIcon,
    Heading,
    Box,
    Text,
} from "native-base";
import React from "react";
import { useGlobalize } from "react-native-globalize";
import { useSelector } from "react-redux";

import { Colors } from "../../app/utils/Constants";
import { selectAssetValueByWallet } from "../portfolio/portfolioSlice";

const getAssetFlexValue = (value) => {
    if (value > 0.05) {
        return Math.floor(value * 20);
    } else {
        return Math.floor(value * 20 + 1);
    }
};

function WalletHeader({ navigation, address, chain }) {
    const { formatCurrency } = useGlobalize();
    const assetsValue = useSelector((state) =>
        selectAssetValueByWallet(state, address, chain)
    );
    const { tokensWorth, nftsWorth } = assetsValue;
    const totalValue = tokensWorth + nftsWorth;
    const tokensFlex = getAssetFlexValue(tokensWorth / totalValue);
    const nftsFlex = getAssetFlexValue(nftsWorth / totalValue);
    const goBack = () => {
        navigation.navigate("Home");
    };
    return (
        <VStack my="3">
            <HStack alignItems="center" justifyContent="space-between">
                <ChevronLeftIcon size="7" m="5" onPress={goBack} />
                <Heading size="xs">{address}</Heading>
                <Box flex="1" />
            </HStack>
            <VStack alignItems="flex-start" py="2" px="5">
                <Text fontSize="md">Total Value:</Text>
                <Text fontSize="xl">{formatCurrency(totalValue, "USD")}</Text>
            </VStack>
            <HStack px="10" justifyContent="space-between">
                <Text fontSize="md">Tokens Worth:</Text>
                <Text fontSize="md">NFTs Worth:</Text>
            </HStack>
            <HStack px="10" justifyContent="space-between">
                <Text fontSize="md">{formatCurrency(tokensWorth, "USD")}</Text>
                <Text fontSize="md">{formatCurrency(nftsWorth, "USD")}</Text>
            </HStack>
            <HStack px="10" h="3" mt="2">
                <Box
                    flex={tokensFlex}
                    borderLeftRadius="5"
                    bg={Colors.TokenColor}
                />
                <Box
                    flex={nftsFlex}
                    borderRightRadius="5"
                    bg={Colors.NftColor}
                />
            </HStack>
        </VStack>
    );
}

export default WalletHeader;
