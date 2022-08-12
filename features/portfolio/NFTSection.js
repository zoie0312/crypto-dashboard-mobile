import { Center, ChevronRightIcon, VStack, ScrollView } from "native-base";
import React from "react";
import { useSelector } from "react-redux";

import { selectNftsByWallet } from "../../features/portfolio/portfolioSlice";
import NFTCard from "./NFTCard";

const NFTSection = ({ ownerAddress, chain }) => {
    const nftData = useSelector((state) =>
        selectNftsByWallet(state, ownerAddress, chain)
    );
    let reduceNftData = [];
    try {
        reduceNftData =
            nftData &&
            nftData.reduce((acc, curr, idx) => {
                if (idx < 6) {
                    acc.push({
                        title: curr.title,
                        imageUrl: curr.imageUrl,
                        contractAddress: curr.contractAddress,
                        tokenId: curr.tokenId,
                    });
                }
                if (idx === 6) {
                    acc.push({
                        more: true,
                    });
                }
                return acc;
            }, []);
    } catch (error) {
        console.log("NFTSection error, ", error);
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
                horizontal
            >
                {reduceNftData.map((data, idx) =>
                    data.more ? (
                        <Center bg="primary.400" p="6" key="more..">
                            <ChevronRightIcon
                                size="xl"
                                onPress={() => console.log("more nfts ...")}
                            />
                        </Center>
                    ) : (
                        <NFTCard
                            key={data.tokenId}
                            title={data.title}
                            imageUrl={data.imageUrl}
                            contractAddress={data.contractAddress}
                            floorPrice={data.floorPrice}
                            priceCurrency={data.priceCurrency}
                        />
                    )
                )}
            </ScrollView>
        </VStack>
    );
};

export default NFTSection;
