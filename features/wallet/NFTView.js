import { FlatList, Stack, Center } from "native-base";
import React from "react";
//import { Image as RNImage } from "react-native";
import { useSelector } from "react-redux";

//import { useGetNftFloorPriceQuery } from "../../app/services/api";
//import default_nft_icon256 from "../../assets/images/default_nft_icon256.png";
//import { NFTData } from "../../common/utils/DummyData";
import NFTCard from "../../common/components/NFTCard";
import { selectNftsByWallet } from "../portfolio/portfolioSlice";

//const DEFAULT_NFT_IMAGE = RNImage.resolveAssetSource(default_nft_icon256).uri;

function NFTView({ navigation, route }) {
    const { ownerAddress, chain } = route?.params;
    //console.count("nftview ", ownerAddress);
    const nftData = useSelector((state) =>
        selectNftsByWallet(state, ownerAddress, chain)
    );
    //nftData.forEach(item => useGetNftFloorPriceQuery(item.contractAddress))
    //const nftPrices = useSelector((state) => state.portfolio.nftPrices);
    const renderRow = ({ item, idx }) => {
        const { title, imageUrl, contractAddress } = item;
        // const priceCurrency =
        //     nftPrices[contractAddress]?.priceCurrency ?? "ETH";
        // const floorPrice = nftPrices[contractAddress]?.floorPrice;
        //const imgSource = imageUrl ? imageUrl : DEFAULT_NFT_IMAGE;
        return (
            /* <Center>
                {/* <VStack
                    my="3"
                    borderRadius="xl"
                    h="80"
                    w="80"
                    justifyContent="space-between"
                    bg="white"
                    shadow={2}
                >
                    <Text fontSize="md" flex="1" px="5">
                        {title}
                    </Text>
                    <Center flex="7">
                        <Image
                            fallbackSource={{ uri: DEFAULT_NFT_IMAGE }}
                            source={{
                                uri: imgSource,
                                cache: "only-if-cached",
                            }}
                            //onError={imageErrorHandler}
                            key={imageUrl}
                            alt="missing image"
                            size="56"
                        />
                    </Center>

                    <Text fontSize="md" flex="1" px="5">
                        {floorPrice} {priceCurrency}
                    </Text>
                </VStack> */
            <NFTCard
                title={title}
                imageUrl={imageUrl}
                contractAddress={contractAddress}
                //floorPrice={data.floorPrice}
                //priceCurrency={data.priceCurrency}
                size="big"
            />
            // </Center>
        );
    };

    return (
        <Stack direction="column" flex="1">
            <FlatList
                data={nftData}
                renderItem={renderRow}
                keyExtractor={(item) => item.tokenId}
            />
        </Stack>
    );
}

export default NFTView;
