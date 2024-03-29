import { HStack, Text, VStack, Box, Heading } from "native-base";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import { useGlobalize } from "react-native-globalize";
import { useSelector } from "react-redux";

//import { pieChartData } from "../../common/utils/DummyData";
//import { PortfolioContext } from "../../context/PortfolioContext";

const MainSection = () => {
    const { formatCurrency, formatNumber } = useGlobalize();
    const tokensWorth = useSelector((state) => state.portfolio.tokensWorth);
    const nftsWorth = useSelector((state) => state.portfolio.nftsWorth);
    const totalValue = tokensWorth + nftsWorth;
    const pieChartData = [
        {
            value: nftsWorth,
            color: "#e68A00",
            text: formatNumber(nftsWorth / totalValue, { style: "percent" }),
        },
        {
            value: tokensWorth,
            color: "#1F7A1F",
            text: formatNumber(tokensWorth / totalValue, { style: "percent" }),
        },
    ];

    return (
        <VStack px={4}>
            <HStack alignItems="center" justifyContent="space-between">
                <Heading italic size="lg">
                    {formatCurrency(totalValue, "USD")}
                </Heading>
                <VStack>
                    <HStack
                        alignItems="center"
                        space="2"
                        justifyContent="space-between"
                    >
                        <Text fontSize="sm" color="trueGray.400">
                            Wallet
                        </Text>
                        <Text fontSize="md">
                            {formatCurrency(tokensWorth, "USD")}
                        </Text>
                    </HStack>
                    <HStack
                        alignItems="center"
                        space="2"
                        justifyContent="space-between"
                    >
                        <Text fontSize="sm" color="trueGray.400">
                            NFTs Worth
                        </Text>
                        <Text fontSize="md">
                            {formatCurrency(nftsWorth, "USD")}
                        </Text>
                    </HStack>
                </VStack>
            </HStack>
            <HStack px="3" mt="2" rounded="lg" alignItems="center">
                <PieChart
                    data={pieChartData}
                    showText
                    textColor="black"
                    radius={50}
                />
                <HStack justifyContent="space-around" flex={1} p="2" ml="5">
                    <HStack space={2} alignItems="center">
                        <Box
                            backgroundColor="#1F7A1F"
                            size="3"
                            borderRadius="6"
                        />
                        <Text fontSize="lg" color="trueGray.400">
                            Wallet
                        </Text>
                    </HStack>
                    <HStack space={2} alignItems="center">
                        <Box
                            backgroundColor="#e68A00"
                            size="3"
                            borderRadius="6"
                        />
                        <Text fontSize="lg" color="trueGray.400">
                            NFTs
                        </Text>
                    </HStack>
                </HStack>
            </HStack>
        </VStack>
    );
};

export default MainSection;
