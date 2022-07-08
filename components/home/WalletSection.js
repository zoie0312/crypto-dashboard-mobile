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

const assetData = [
    {
        assetName: 'USDC',
        assetlogo: 'https://static.alchemyapi.io/images/assets/3408.png',
        balance: '19,185.17',
        valueInReferenceCurrency: '19,185.17'
    },
    {
        assetName: 'USDT',
        assetlogo: 'https://static.alchemyapi.io/images/assets/825.png',
        balance: '1,155.17',
        valueInReferenceCurrency: '1,155.17'
    },
    {
        assetName: 'DAI',
        assetlogo: 'https://static.alchemyapi.io/images/assets/4943.png',
        balance: '300.00',
        valueInReferenceCurrency: '300.01'
    },
    {
        assetName: 'SHIB',
        assetlogo: 'https://static.alchemyapi.io/images/assets/5994.png',
        balance: '35,600.34',
        valueInReferenceCurrency: '102.74'
    },
    {
        assetName: 'WBTC',
        assetlogo: 'https://static.alchemyapi.io/images/assets/3717.png',
        balance: '1.17',
        valueInReferenceCurrency: '20,000.66'
    },
    {
        assetName: 'FTT',
        assetlogo: 'https://static.alchemyapi.io/images/assets/4195.png',
        balance: '512.40',
        valueInReferenceCurrency: '1,500.40'
    },
    
];

const AssetCard = (props) => {
    const {assetName, assetlogo, balance, valueInReferenceCurrency} = props;
    return (
        <VStack  
            my="4" 
            mr="3" 
            p="3" 
            rounded="lg" 
            h="32" 
            w="24" 
            justifyContent="space-between" 
            shadow={2}
            bg='trueGray.200'
        >
            <HStack  alignItems="center" >
                <Image
                    source={{
                        uri: assetlogo
                    }}
                    mr="2"
                    alt={assetName}
                    size="2xs"
                />
                <Text  fontSize="sm">{assetName}</Text>
            </HStack>
            <VStack  space="1">
                <Text  fontSize="sm">{balance}</Text>
                <Text  fontSize="sm">${valueInReferenceCurrency}</Text>
            </VStack>
        </VStack>
    )
}

const WalletSection = () => {
  return (
    <VStack  flex={1} mt="5" bg={'white'}>
        {/* <SectionHeader
            title='Wallet'
            value='20,000'
        /> */}
        {/* <ScrollView showsVerticalScrollIndicator={false} >
            {
                assetData.map((data, idx) => (
                    <AssetCard
                        key={data.assetName}
                        assetName={data.assetName}
                        assetlogo={data.assetlogo}
                        balance={data.balance}
                        valueInReferenceCurrency={data.valueInReferenceCurrency}
                    />
                ))
            }
        </ScrollView> */}
        <VStack rounded={'md'}>
            <Text fontSize={'md'}>0x222222221118679dddaafh</Text>
            <Divider width={'90%'}/>

        </VStack>
            
    </VStack>
  )
}

export default WalletSection