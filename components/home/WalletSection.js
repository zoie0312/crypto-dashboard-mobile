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
    Divider
 } from 'native-base';
import SectionHeader from './SectionHeader' 
import NFTSection from './NFTSection'

const assetData = [
    {
        assetName: 'USDC',
        assetlogo: 'https://static.alchemyapi.io/images/assets/3408.png',
        balance: '19185.17',
        exchangeRate: '1.00',
        
    },
    {
        assetName: 'USDT',
        assetlogo: 'https://static.alchemyapi.io/images/assets/825.png',
        balance: '1155.17',
        exchangeRate: '1.00',
        
    },
    {
        assetName: 'DAI',
        assetlogo: 'https://static.alchemyapi.io/images/assets/4943.png',
        balance: '300.00',
        exchangeRate: '1.00',
        
    },
    {
        assetName: 'SHIB',
        assetlogo: 'https://static.alchemyapi.io/images/assets/5994.png',
        balance: '35600.34',
        exchangeRate: '0.0000045',
        
    },
    {
        assetName: 'WBTC',
        assetlogo: 'https://static.alchemyapi.io/images/assets/3717.png',
        balance: '1.17',
        exchangeRate: '2200.30',
        
    },
    {
        assetName: 'FTT',
        assetlogo: 'https://static.alchemyapi.io/images/assets/4195.png',
        balance: '512.40',
        exchangeRate: '25.67',
        
    },
    {
        assetName: 'ZXC',
        assetlogo: 'https://static.alchemyapi.io/images/assets/4195.png',
        balance: '333.40',
        exchangeRate: '20.67',
        
    },
];

const NFTData = [
    {
        title: 'Fomo Dog #310',
        imageUrl:
            'https://res.cloudinary.com/alchemyapi/image/upload/w_256,h_256/mainnet/834b0c1d604f74fbdfbf110aa28e48d8.png',
        price: 3.5,
        currency: 'eth',
    },
    {
        title: 'GalaXY Kats #2809',
        imageUrl:
            'https://res.cloudinary.com/alchemyapi/image/upload/w_256,h_256/mainnet/01a771154727397ea3455b1a9a8ec94d.png',
        price: 0.5,
        currency: 'eth',
    },
    {
        title: 'Chicken 7687',
        imageUrl:
            'https://static.debank.com/image/matic_nft/local_url/a08c12b657bd46b760072ce37adb7051/ad0c0740193cff946c2e0afeae175525.png',
        price: 0.59,
        currency: 'eth',
    },
    {
        title: 'RR Car #408',
        imageUrl:
            'https://static.debank.com/image/matic_nft/local_url/d17ff48b501d2103185432e5d9692817/e19f165d7442df87b54dcdc9dc480242.png',
        price: 0.123,
        currency: 'eth',
    },
]

const AssetCard = (props) => {
    const {assetName, assetlogo, balance, exchangeRate} = props;
    const valueInUSD = (Math.round(parseFloat(balance) * parseFloat(exchangeRate) * 100) / 100).toFixed(2);
    return (
        <HStack 
            justifyContent='space-between' 
            m='1' 
            px='2' 
            alignItems="center" 
            bg='warmGray.400' 
            borderRadius='15' 
            w='45%'
        >
                <HStack alignItems="center">
                    <Image
                        source={{
                            uri: assetlogo
                        }}
                        mr="2"
                        alt={assetName}
                        size="2xs"
                    />
                    <VStack >
                        <Text fontSize="sm" fontWeight='bold' color='white'>{assetName}</Text>
                        <Text fontSize="xs" color='warmGray.300'>{exchangeRate}</Text>
                    </VStack>
                </HStack>
                <VStack alignItems='flex-end'>
                    <Text fontSize="sm" fontWeight='bold' color='white'>{valueInUSD}</Text>
                    <Text fontSize="xs" color='warmGray.300'>{balance}</Text>
                </VStack>
            </HStack>
    )
}

const WalletSection = (props) => {
    const reduceAssetData = assetData.reduce((acc, curr, idx) => {
        if (idx < 7 && (idx%2 === 0)) {
            acc.push({
                leftData: assetData[idx],
                rightData: assetData[idx+1]
            })
        }
        return acc;
    }, []);
    return (
        <VStack  flex={1} my="1" bg={'white'} rounded='xl' mx='2'>
            <VStack rounded={'md'} p='2'>
                <Text fontSize={'md'} fontWeight='bold'> {props.address}</Text>
                <Divider width={'100%'} my='1'/>
                {
                    reduceAssetData.map((data, idx) => {
                        const {leftData, rightData} = data;
                        return (
                            (idx <=2) && <HStack 
                                alignItems="center" 
                                key={leftData.assetName}
                                justifyContent='space-between'
                                
                            >
                                <AssetCard
                                    assetName={leftData.assetName}
                                    assetlogo={leftData.assetlogo}
                                    balance={leftData.balance}
                                    exchangeRate={leftData.exchangeRate}
                                />
                                {
                                    (rightData && idx === 2 && reduceAssetData[3]) ? 
                                        <HStack w="45%" p="2" rounded="lg">
                                            <Text  fontWeight='bold' fontSize="xl">...</Text>
                                        </HStack> :
                                    rightData ? 
                                        <AssetCard
                                            assetName={rightData.assetName}
                                            assetlogo={rightData.assetlogo}
                                            balance={rightData.balance}
                                            exchangeRate={rightData.exchangeRate}
                                        /> : <Box  p="2" rounded="lg"/>
                                }    
                            </HStack>
                        )                
                    })
                }
                <Divider width={'100%'} my='1'/>
                <NFTSection 
                    nftData={NFTData}
                />
            </VStack>
        </VStack>
  )
}

export default WalletSection