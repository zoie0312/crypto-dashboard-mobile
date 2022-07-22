import React, {useContext, useRef} from 'react'
import { 
    HStack, 
    Text, 
    Center, 
    ChevronRightIcon, 
    VStack,
    Box,
    Image,
    ScrollView,
    Divider,
    Icon,
    IconButton,
    Spinner
 } from 'native-base';
 import { AntDesign } from '@expo/vector-icons'
import SectionHeader from './SectionHeader' 
import NFTSection from './NFTSection'
import { assetData, NFTData } from '../../DummyData'
import useNFT from '../../hooks/useNFT'
import { PortfolioContext } from '../../context/PortfolioContext'
import { CryptoPriceContext } from '../../context/CryptoPriceContext'
import { NFTPriceContext } from '../../context/NFTPriceContext'

const AssetCard = (props) => {
    const {assetName, assetLogo, balance, exchangeRate} = props;
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
                        uri: assetLogo
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

const WalletSection = ({chain, address, ...props}) => {
    const cryptoPrices = useContext(CryptoPriceContext);
    const { dispatch: nftPriceDispatch} = useContext(NFTPriceContext);
    const { wallets, dispatch: portfolioDispatch } = useContext(PortfolioContext);
    const targetWallet = wallets.find(wallet => (wallet.chain === chain) && (wallet.address === address));
    const isNFTsLoaded = targetWallet && targetWallet.nftAssets;
    const [{ isLoading, nftData }, fetchNFTData] = useNFT({
        address, 
        chain, 
        isLoaded: isNFTsLoaded, 
        portfolioDispatch,
        nftPriceDispatch,
        cryptoPrices
    });
        
    let reduceNFTData = [],
        reduceAssetData = [];
    if (isNFTsLoaded) {
        reduceNFTData = targetWallet.nftAssets.reduce((acc, curr, idx) => {
            if (idx < 20) {
                acc.push({
                    title: curr.title,
                    imageUrl: curr.imageUrl,
                    contractAddress: curr.contractAddress,
                    tokenId: curr.tokenId,
                    floorPrice: curr.floorPrice,
                    priceCurrency: curr.priceCurrency
                })
            }
            if (idx === 20) {
                acc.push({
                    more: true
                })
            }
            return acc;
        }, []);
    }
    
    reduceAssetData = assetData.reduce((acc, curr, idx) => {
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
                <HStack justifyContent='space-between' alignItems="center">
                    <Text fontSize={'xs'} fontWeight='bold'> {address}</Text>
                    {
                        isLoading ? <Spinner size="sm" color="cyan.500"/> : 
                            <IconButton
                                icon={<Icon size="sm" as={AntDesign} name="reload1" color="cyan.500" />}
                                onPress={()=>{
                                    fetchNFTData();
                                }}
                            />    
                    }
                </HStack>
                
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
                                    assetLogo={leftData.assetLogo}
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
                                            assetLogo={rightData.assetLogo}
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
                    nftData={reduceNFTData}
                />
            </VStack>
        </VStack>
  )
}



export default WalletSection