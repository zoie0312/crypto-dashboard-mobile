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

function NFTCard({ title, imageUrl, contractAddress }) {
    //console.log('NFTCard tokenID= ', tokenId);
    // const imgSource = {
    //     uri: imageUrl? imageUrl : DEFAULT_IMAGE,
    //     //uri: DEFAULT_IMAGE
    // }
    const [imgSource, setImgSource] = useState(imageUrl? imageUrl : DEFAULT_IMAGE);
    const cryptoPrices = useContext(CryptoPriceContext);
    const { updateNFTPrice } = useContext(PortfolioContext);
    //const { priceData } = useFloorPrice({ contractAddress, updateNFTPrice, cryptoPrices });
    //const {floorPrice, priceCurrency, floorPriceInUSD} = priceData;
    //console.log('NFTCard, priceData= ', priceData);
    const floorPrice = 0;
    const priceCurrency = 'ETH';    
    let floorPriceInUSD;
    if (floorPrice) {
        floorPriceInUSD = floorPrice * cryptoPrices[priceCurrency]['USD'];
    }
    
    // useEffect(() => {
    //     dispatch({
    //         type: 'UPDATE_PORTFOLIO_NFT_PRICE',
    //         payload: {
    //             contractAddress, 
    //             floorPriceData: {floorPrice, priceCurrency, floorPriceInUSD}
    //         }
    //     });
    // }, [ contractAddress, cryptoPrices])
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