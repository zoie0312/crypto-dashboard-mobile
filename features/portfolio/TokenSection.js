import { HStack, Text, VStack, Box, Image, Divider } from "native-base";
import React from "react";
import { useGlobalize } from "react-native-globalize";
import { useSelector } from "react-redux";

import { useGetCryptoPricesQuery } from "../../app/services/api";
import { selectTokensByWallet } from "../../features/portfolio/portfolioSlice";

const AssetCard = (props) => {
    const { formatNumber } = useGlobalize();
    const { assetName, assetLogo, balance } = props;
    const { data: cryptoPrices } = useGetCryptoPricesQuery();
    const exchangeRate = cryptoPrices?.[assetName]?.["USD"] || 0;
    const valueInUSD = formatNumber(balance * exchangeRate, {
        maximumFractionDigits: 2,
    });
    return (
        <HStack
            justifyContent="space-between"
            m="1"
            px="2"
            alignItems="center"
            bg="warmGray.400"
            borderRadius="15"
            w="45%"
        >
            <HStack alignItems="center">
                <Image
                    source={{
                        uri: assetLogo,
                    }}
                    mr="2"
                    alt={assetName}
                    size="2xs"
                />
                <VStack>
                    <Text fontSize="sm" fontWeight="bold" color="white">
                        {assetName}
                    </Text>
                    <Text fontSize="xs" color="warmGray.300">
                        {formatNumber(exchangeRate, {
                            maximumFractionDigits: 2,
                        })}
                    </Text>
                </VStack>
            </HStack>
            <VStack alignItems="flex-end">
                <Text fontSize="sm" fontWeight="bold" color="white">
                    {valueInUSD}
                </Text>
                <Text fontSize="xs" color="warmGray.300">
                    {formatNumber(balance, { maximumFractionDigits: 2 })}
                </Text>
            </VStack>
        </HStack>
    );
};

function TokenSection({ ownerAddress, chain }) {
    const tokenAssets = useSelector((state) =>
        selectTokensByWallet(state, ownerAddress, chain)
    );
    let reduceAssetData = [];
    try {
        reduceAssetData =
            tokenAssets &&
            tokenAssets.reduce((acc, curr, idx) => {
                if (idx < 7 && idx % 2 === 0) {
                    acc.push({
                        leftData: tokenAssets[idx],
                        rightData: tokenAssets[idx + 1],
                    });
                }
                return acc;
            }, []);
    } catch (error) {
        console.log("TokenSection error, ", error);
    }

    return (
        <Box>
            {reduceAssetData.map((data, idx) => {
                const { leftData, rightData } = data;
                return (
                    idx <= 2 && (
                        <HStack
                            alignItems="center"
                            key={leftData.symbol}
                            justifyContent="space-between"
                        >
                            <AssetCard
                                assetName={leftData.symbol}
                                assetLogo={leftData.thumbnail}
                                balance={leftData.balance}
                                exchangeRate={leftData.exchangeRate}
                            />
                            {rightData && idx === 2 && reduceAssetData[3] ? (
                                <HStack w="45%" p="2" rounded="lg">
                                    <Text fontWeight="bold" fontSize="xl">
                                        ...
                                    </Text>
                                </HStack>
                            ) : rightData ? (
                                <AssetCard
                                    assetName={rightData.symbol}
                                    assetLogo={rightData.thumbnail}
                                    balance={rightData.balance}
                                    exchangeRate={rightData.exchangeRate}
                                />
                            ) : (
                                <Box p="2" rounded="lg" />
                            )}
                        </HStack>
                    )
                );
            })}
            <Divider width="100%" my="1" />
        </Box>
    );
}

export default TokenSection;
