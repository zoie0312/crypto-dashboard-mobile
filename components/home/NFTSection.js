import React from 'react'
import {
    HStack,
    Text,
    Center,
    ChevronRightIcon,
    VStack,
    Box,
    Image,
    ScrollView,
} from 'native-base'
import SectionHeader from './SectionHeader'

const NFTCard = (props) => {
    const { title, imageUrl, price, currency } = props
    const imgSource = {
        uri: imageUrl,
    }
    return (
        <VStack
            my="4"
            mr="3"
            rounded="lg"
            h="56"
            w="40"
            justifyContent="space-between"
            bg="white"
            shadow={2}
        >
            <Text fontSize="sm" flex="1" px="2">
                {title}
            </Text>
            <Image source={imgSource} key={imageUrl} alt={title} flex="5" />
            <Text fontSize="sm" flex="1" px="2">
                {price} {currency}
            </Text>
        </VStack>
    )
}

const NFTSection = (props) => {
    return (
        <VStack>
            <ScrollView
                pl="3"
                showsHorizontalScrollIndicator={false}
                horizontal={true}
            >
                {props.nftData.map((data, idx) => (
                    <NFTCard
                        key={idx}
                        title={data.title}
                        imageUrl={data.imageUrl}
                        price={data.price}
                        currency={data.currency}
                    />
                ))}
            </ScrollView>
        </VStack>
    )
}

export default NFTSection
