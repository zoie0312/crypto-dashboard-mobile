import React from 'react'
import { 
    HStack, 
    Text, 
    Center, 
    ChevronRightIcon, 
    VStack,
    Box,
    Image,
    ScrollView
 } from 'native-base';
import SectionHeader from './SectionHeader' 

const NFTData = [
    {
        title: 'Fomo Dog #310',
        imageUrl: "https://res.cloudinary.com/alchemyapi/image/upload/w_256,h_256/mainnet/834b0c1d604f74fbdfbf110aa28e48d8.png",
        price: 3.5,
        currency: 'eth'
    },
    {
        title: 'GalaXY Kats #2809',
        imageUrl: "https://res.cloudinary.com/alchemyapi/image/upload/w_256,h_256/mainnet/01a771154727397ea3455b1a9a8ec94d.png",
        price: 0.5,
        currency: 'eth'
    },
    {
        title: 'Chicken 7687',
        imageUrl: "https://static.debank.com/image/matic_nft/local_url/a08c12b657bd46b760072ce37adb7051/ad0c0740193cff946c2e0afeae175525.png",
        price: 0.59,
        currency: 'eth'
    },
    {
        title: 'RR Car #408',
        imageUrl: "https://static.debank.com/image/matic_nft/local_url/d17ff48b501d2103185432e5d9692817/e19f165d7442df87b54dcdc9dc480242.png",
        price: 0.123,
        currency: 'eth'
    }
];

const NFTCard = (props) => {
    const {title, imageUrl, price, currency} = props;
    const imgSource = {
        uri: imageUrl
    };
    return (
        <VStack  my="4" mr="3" rounded="lg" h="56" w="40" justifyContent="space-between" bg="white" shadow={2}>
            <Text  fontSize="sm" flex="1" px="2">{title}</Text>
            <Image
                source={imgSource}
                key={imageUrl}
                alt={title}
                flex="5"
            />
            <Text fontSize="sm" flex="1" px="2">{price} {currency}</Text>
            
        </VStack>
    )
} 

const NFTSection = () => {
  return (
    <VStack  mt="5">
        <SectionHeader
            title='NFTs worth'
            value='1,000'
        />
        <ScrollView pl="3" showsHorizontalScrollIndicator={false} horizontal={true}>
            {
                NFTData.map((data, idx) => (
                    <NFTCard
                        key={idx}
                        title={data.title}
                        imageUrl={data.imageUrl}
                        price={data.price}
                        currency={data.currency}
                    />
                ))
            }
        </ScrollView>
        
    </VStack>
  )
}

export default NFTSection