import { View } from 'react-native'
import React from 'react'
import {
    HStack,
    Text,
    Center,
    VStack,
    Box,
    Heading,
} from 'native-base'
import { PieChart } from 'react-native-gifted-charts'

const pieChartData = [
    { value: 1000, color: '#e68A00', text: '33%' },
    { value: 2000, color: '#1F7A1F', text: '67%' },
]

const MainSection = () => {
    return (
        <VStack px={4}>
            <HStack alignItems={'center'} justifyContent="space-between">
                <Heading italic size='2xl'>$3,500.40</Heading>
                <VStack>
                    <HStack alignItems={'center'} space="2" justifyContent="space-between">
                        <Text fontSize="sm" color="trueGray.400">Wallet</Text>
                        <Text fontSize="md">$2,000.00</Text>
                    </HStack>
                    <HStack alignItems={'center'} space="2" justifyContent="space-between">
                        <Text fontSize="sm" color="trueGray.400">NFTs Worth</Text>
                        <Text fontSize="md">$1,500.00</Text>
                    </HStack>
                </VStack>
                
            </HStack>
            <HStack px='3' mt='2' rounded="lg" alignItems={'center'}>
                <PieChart
                    data={pieChartData}
                    showText
                    textColor="black"
                    radius={50}
                />
                <HStack justifyContent="space-around" flex={1} p="2" ml="5">
                    <HStack space={2} alignItems="center">
                        <Box
                            backgroundColor={'#1F7A1F'}
                            size="3"
                            borderRadius="6"
                        />
                        <Text fontSize="lg" color="trueGray.400">
                            Wallet
                        </Text>
                    </HStack>
                    <HStack space={2} alignItems="center">
                        <Box
                            backgroundColor={'#e68A00'}
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
    )
}

export default MainSection
