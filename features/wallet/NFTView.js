import { FlatList, Stack, Center } from "native-base";
import React from "react";
import { useSelector } from "react-redux";

//import { NFTData } from "../../common/utils/DummyData";
import NFTCard from "../../common/components/NFTCard";
import { selectNftsByWallet } from "../portfolio/portfolioSlice";

function NFTView({ navigation, route }) {
    const { ownerAddress, chain } = route?.params;
    console.log("NFTView render ", ownerAddress);
    const nftData = useSelector((state) =>
        selectNftsByWallet(state, ownerAddress, chain)
    );
    const renderRow = ({ item, idx }) => {
        const { title, imageUrl, contractAddress } = item;
        return (
            <Center>
                <NFTCard
                    title={title}
                    imageUrl={imageUrl}
                    contractAddress={contractAddress}
                    size="big"
                />
            </Center>
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
