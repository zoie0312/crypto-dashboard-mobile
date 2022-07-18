import React, {useEffect, useContext} from 'react'
import {Image as RNImage} from 'react-native';
import {
    Text,
    VStack,
    Image,
} from 'native-base'
import useFloorPrice from '../../hooks/useFloorPrice'
import { PortfolioContext } from '../../context/PortfolioContext'
import {CryptoPriceContext} from '../../context/CryptoPriceContext'
import { formatMoney } from '../../Utils';
import deals from '../../assets/images/deals.png';

const DEFAULT_IMAGE = RNImage.resolveAssetSource(deals).uri;

function NFTCard(props) {
    const { title, imageUrl, contractAddress } = props;
    //console.log('NFTCard title= ', title);
    const imgSource = {
        uri: imageUrl? imageUrl : DEFAULT_IMAGE,
    }
    const cryptoPrices = useContext(CryptoPriceContext);
    const { isLoading, isError, priceData } = useFloorPrice({ contractAddress });
    const {floorPrice, priceCurrency} = priceData;
    //console.log('NFTCard, priceData= ', priceData);
    let floorPriceInUSD;
    if (floorPrice) {
        floorPriceInUSD = floorPrice * cryptoPrices[priceCurrency]['USD'];
    }
        
    const { dispatch } = useContext(PortfolioContext);
    useEffect(() => {
        dispatch({
            type: 'UPDATE_PORTFOLIO_NFT_PRICE',
            payload: {
                contractAddress, 
                floorPriceData: {floorPrice, priceCurrency, floorPriceInUSD}
            }
        });
    }, [priceData, contractAddress, cryptoPrices])
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
            <Text fontSize="sm" flex="2" px="2">
                {title}
            </Text>
            <Image source={imgSource} key={imageUrl} bg='primary.300' alt='missing image' flex='6' />
            <Text fontSize="sm" flex="1" px="2">
                {floorPrice} {priceCurrency}
            </Text>
        </VStack>
    )
}

export default NFTCard