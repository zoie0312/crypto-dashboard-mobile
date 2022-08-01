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
import TokenSection from './TokenSection'
import { assetData, NFTData } from '../../common/utils/DummyData'
import useNFT from '../../common/hooks/useNFT'
import useWallet from '../../common/hooks/useWallet'
import { useGetNftsQuery } from '../../app/services/api';
import { useGetTokenBalanceQuery } from '../../app/services/api';
import { useGetNativeTokenBalanceQuery } from '../../app/services/api';


const WalletSection = ({chain, address, ...props}) => {
    const { isFetching: isFetchingNfts, refetch: refetchWalletNfts} = useGetNftsQuery(address);
    const { isFetching: isFetchingTokens, refetch: refetchWalletTokens} = useGetTokenBalanceQuery(address);
    const { isFetching: isFetchingNativeToken, refetch: refetchWalletNativeToken} = useGetNativeTokenBalanceQuery(address);
    const isLoadingAssets = isFetchingNfts || isFetchingTokens || isFetchingNativeToken;

    return (    
        <VStack  flex={1} my="1" bg={'white'} rounded='xl' mx='2'>
            <VStack rounded={'md'} p='2'>
                <HStack justifyContent='space-between' alignItems="center">
                    <Text fontSize={'xs'} fontWeight='bold'> {address}</Text>
                    {
                        isLoadingAssets ? <Spinner size="sm" color="cyan.500"/> : 
                            <IconButton
                                icon={<Icon size="sm" as={AntDesign} name="reload1" color="cyan.500" />}
                                onPress={()=>{
                                    refetchWalletNfts();
                                    refetchWalletTokens();
                                    refetchWalletNativeToken();
                                }}
                            />    
                    }
                </HStack>
                
                <Divider width={'100%'} my='1'/>
                
                <TokenSection
                    ownerAddress={address}
                    chain={chain}
                />
                <NFTSection
                    ownerAddress={address}
                    chain={chain} 
                />
            </VStack>
        </VStack>
  )
}

export default WalletSection