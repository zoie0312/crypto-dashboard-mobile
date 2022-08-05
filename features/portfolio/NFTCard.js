import React, {useRef, useContext, useState} from 'react'
import { useSelector } from 'react-redux'
import {Image as RNImage} from 'react-native';
import {
    Text,
    VStack,
    Image,
} from 'native-base'
import default_nft_icon256 from '../../assets/images/default_nft_icon256.png';
import { useGetNftFloorPriceQuery } from '../../app/services/api'

const DEFAULT_NFT_IMAGE = RNImage.resolveAssetSource(default_nft_icon256).uri;

function NFTCard({ title, imageUrl, contractAddress }) {
    const imgSource = imageUrl? imageUrl : DEFAULT_IMAGE;
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
            {/* <Text>
                {renderCount.current+=1}
                {console.log('NFTCard render ', renderCount.current)}
            </Text> */}
            <Text fontSize="sm" flex="2" px="2">
                {title}
            </Text>
            <Image 
                fallbackSource={{uri: DEFAULT_NFT_IMAGE}}
                source={{uri: imgSource}}
                //onError={imageErrorHandler} 
                key={imageUrl} 
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