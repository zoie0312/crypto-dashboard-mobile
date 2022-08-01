import React from 'react'
import { useSelector } from 'react-redux'
import {
    HStack,
    Text,
    Center,
    ChevronRightIcon,
    VStack,
    Box,
    Image,
    ScrollView,
    FlatList
} from 'native-base'
import SectionHeader from './SectionHeader'
import NFTCard from './NFTCard'
import {selectNftsByWallet} from '../../features/portfolio/portfolioSlice'

const NFTSection = ({ownerAddress, chain}) => {
    const nftData = useSelector(state => selectNftsByWallet(state, ownerAddress, chain));
    let reduceNftData = [];
    try {
        reduceNftData = nftData && nftData.reduce((acc, curr, idx) => {
            if (idx < 20) {
                acc.push({
                    title: curr.title,
                    imageUrl: curr.imageUrl,
                    contractAddress: curr.contractAddress,
                    tokenId: curr.tokenId,
                })
            }
            if (idx === 20) {
                acc.push({
                    more: true
                })
            }
            return acc;
        }, []);    
    } catch (error) {
        console.log('NFTSection error, ', error);
    }
    
    return (
        <VStack>
            {/* <FlatList
                data={props.nftData}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item) => item.tokenId}
                renderItem={({ item }) => {
                    return item.more ? 
                        <Center  bg="primary.400" p="10">
                            <ChevronRightIcon size='lg'/>
                        </Center> :
                        <NFTCard
                            title={item.title}
                            imageUrl={item.imageUrl}
                            contractAddress={item.contractAddress}
                        />
                }}
                
            /> */}
            <ScrollView
                pl="3"
                showsHorizontalScrollIndicator={false}
                horizontal={true}
            >
                {reduceNftData.map((data, idx) => (
                    data.more ? 
                    <Center  bg="primary.400" p="10" key='more..'>
                        <ChevronRightIcon size='lg'/>
                    </Center> :
                     <NFTCard
                        key={data.tokenId}
                        title={data.title}
                        imageUrl={data.imageUrl}
                        contractAddress={data.contractAddress}
                        floorPrice={data.floorPrice}
                        priceCurrency={data.priceCurrency}
                    />
                ))}
            </ScrollView>
        </VStack>
    )
}

export default NFTSection
