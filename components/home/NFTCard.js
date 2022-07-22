import React, {useRef, useContext, useState} from 'react'
import {Image as RNImage} from 'react-native';
import {
    Text,
    VStack,
    Image,
} from 'native-base'
import useFloorPrice from '../../hooks/useFloorPrice'
import { PortfolioContext } from '../../context/PortfolioContext'
import {CryptoPriceContext} from '../../context/CryptoPriceContext'
import deals from '../../assets/images/deals.png';

const DEFAULT_IMAGE = RNImage.resolveAssetSource(deals).uri;

function NFTCard({ title, imageUrl, contractAddress, floorPrice, priceCurrency }) {
    const imgSource = imageUrl? imageUrl : DEFAULT_IMAGE;
    const cryptoPrices = useContext(CryptoPriceContext);
    
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