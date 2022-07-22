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
    FlatList
} from 'native-base'
import SectionHeader from './SectionHeader'
import NFTCard from './NFTCard'

const NFTSection = (props) => {

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
                {props.nftData.map((data, idx) => (
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
