import React, {useRef, useContext, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Image as RNImage} from 'react-native';
import {
    Text,
    VStack,
    Image,
} from 'native-base'
import deals from '../../assets/images/deals.png';
import { useGetCryptoPricesQuery } from '../../app/services/api'
import { useGetNftFloorPriceQuery } from '../../app/services/api'

const DEFAULT_IMAGE = RNImage.resolveAssetSource(deals).uri;

function NFTCard({ title, imageUrl, contractAddress }) {
    const imgSource = imageUrl? imageUrl : DEFAULT_IMAGE;
    const cryptoPrices = useSelector(state => state.portfolio.cryptoPrices);
    useGetNftFloorPriceQuery(contractAddress);
    const nftPrices = useSelector(state => state.portfolio.nftPrices);
    
    const priceCurrency = nftPrices[contractAddress]?.priceCurrency ?? 'ETH'
    const floorPrice = nftPrices[contractAddress]?.floorPrice;
    const renderCount = useRef(0);

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
            <Text>
                {renderCount.current+=1}
                {console.log('NFTCard render ', renderCount.current)}
            </Text>
            <Text fontSize="sm" flex="2" px="2">
                {title}
            </Text>
            <Image 
                fallbackSource={{uri: DEFAULT_IMAGE}}
                source={{uri: imgSource}}
                //onError={imageErrorHandler} 
                key={imageUrl} 
                bg='primary.300' 
                alt='missing image' 
                flex='6' 
            />

            <Text fontSize="sm" flex="1" px="2">
                {floorPrice} {priceCurrency}
            </Text>
        </VStack>
    )
}

export default React.memo(NFTCard)