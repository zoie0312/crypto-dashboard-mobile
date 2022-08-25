import { Center } from "native-base";
import React, { useRef, useEffect } from "react";
import { View, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";

//import { NFTData } from "../../common/utils/DummyData";
import { api } from "../../app/services/api";
import NFTCard from "../../common/components/NFTCard";
import { selectNftsByWallet } from "../portfolio/portfolioSlice";

function NFTView({ navigation, route }) {
    const { ownerAddress, chain } = route?.params;
    console.log("NFTView render ", ownerAddress);
    const nftData = useSelector((state) =>
        selectNftsByWallet(state, ownerAddress, chain)
    );

    const pageKey = useRef(null);
    const { nftsDataPageKey } = api.endpoints.getNfts.useQueryState(
        { ownerAddress },
        {
            selectFromResult: (result) => {
                return {
                    nftsDataPageKey: result.data?.pageKey,
                };
            },
        }
    );
    useEffect(() => {
        pageKey.current = nftsDataPageKey;
    }, [nftsDataPageKey]);

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

    const dispatch = useDispatch();
    const onEndReached = () => {
        if (pageKey.current) {
            dispatch(
                api.endpoints.getNfts.initiate({
                    ownerAddress,
                    pageKey: pageKey.current,
                })
            );
        }
    };

    return (
        <View style={{ flex: 1 }} >
            <FlatList
                data={nftData}
                renderItem={renderRow}
                keyExtractor={(item) => item.tokenId}
                onEndReachedThreshold={4}
                onEndReached={onEndReached}
                initialNumToRender={7}
            />
        </View>
    );
}

export default NFTView;
