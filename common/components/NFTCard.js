import { Text, VStack, Image, Center } from "native-base";
import React, { useState } from "react";
import { Image as RNImage } from "react-native";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";

import default_nft_icon256 from "../../assets/images/default_nft_icon256.png";

const DEFAULT_NFT_IMAGE = RNImage.resolveAssetSource(default_nft_icon256).uri;

const getStyle = (size) => {
    return {
        my: size === "big" ? "3" : "4",
        mr: size === "big" ? "0" : "3",
        borderRadius: size === "big" ? "xl" : "lg",
        h: size === "big" ? "80" : "56",
        w: size === "big" ? "80" : "40",
        fontSize: size === "big" ? "md" : "sm",
        textPx: size === "big" ? "5" : "2",
        titleFlex: size === "big" ? "1" : "2",
        centerFlex: size === "big" ? "7" : "6",
        loadingImageSize: "16",
        errorImageSize: size === "big" ? "48" : "32",
        imageWidth: size === "big" ? 192 : 128,
        imageHeight: size === "big" ? 192 : 128,
        priceFlex: size === "big" ? "1" : "1",
    };
};

function NFTCard({ title, imageUrl, contractAddress, size }) {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imgSource = imageUrl ? imageUrl : DEFAULT_NFT_IMAGE;
    const nftPrices = useSelector((state) => state.portfolio.nftPrices);

    const priceCurrency = nftPrices[contractAddress]?.priceCurrency ?? "ETH";
    const floorPrice = nftPrices[contractAddress]?.floorPrice;
    const {
        my,
        mr,
        borderRadius,
        h,
        w,
        fontSize,
        textPx,
        titleFlex,
        centerFlex,
        loadingImageSize,
        errorImageSize,
        imageWidth,
        imageHeight,
        priceFlex,
    } = getStyle(size);
    //const renderCount = useRef(1);

    return (
        <VStack
            my={my}
            mr={mr}
            borderRadius={borderRadius}
            h={h}
            w={w}
            justifyContent="space-between"
            bg="white"
            shadow={2}
        >
            {/* <Text>
                {console.log(`${title}  ${renderCount.current}`)}
                {renderCount.current++}
            </Text> */}
            <Text fontSize={fontSize} flex={titleFlex} px={textPx}>
                {title}
            </Text>
            <Center flex={centerFlex}>
                {imageLoading && (
                    <Image
                        source={require("../../assets/images/loading.gif")}
                        size={loadingImageSize}
                        alt="loading..."
                        style={{ position: "absolute" }}
                    />
                )}
                {imageError && (
                    <Image
                        source={require("../../assets/images/default_nft_icon256.png")}
                        size={errorImageSize}
                        alt="defaultImage"
                        style={{ position: "absolute" }}
                    />
                )}
                <FastImage
                    style={{ width: imageWidth, height: imageHeight }}
                    source={{
                        uri: imgSource,
                    }}
                    onLoadStart={() => setImageLoading(true)}
                    onError={() => setImageError(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    key={imageUrl}
                    alt="nft image"
                />
                {/* <Image
                    fallbackSource={{ uri: DEFAULT_NFT_IMAGE }}
                    source={{
                        uri: imgSource,
                        cache: "only-if-cached",
                    }}
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    key={imageUrl}
                    alt="missing image"
                    size={loadingImageSize}
                /> */}
            </Center>

            <Text fontSize={fontSize} flex={priceFlex} px={textPx}>
                {floorPrice} {priceCurrency}
            </Text>
        </VStack>
    );
}

export default React.memo(NFTCard);
