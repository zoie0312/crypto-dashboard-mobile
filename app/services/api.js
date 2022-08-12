import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Constants from "expo-constants";

import { SupportTokens } from "../utils/SupportTokens";

const TOKEN_LIST = Object.keys(SupportTokens).reduce((acc, symbol, idx) => {
    acc += idx === 0 ? symbol.toString() : `,${symbol.toString()}`;
    return acc;
}, "");

const AlchemyApiKey = Constants.manifest.extra.AlchemyApiKey;
const MoralisApiKey = Constants.manifest.extra.MoralisApiKey;

// Define a service using a base URL and expected endpoints
export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: (builder) => ({
        getCryptoPrices: builder.query({
            query: () => ({
                url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${TOKEN_LIST}&tsyms=USD`,
            }),
        }),
        getNfts: builder.query({
            query: (ownerAddress) => ({
                url: `https://eth-mainnet.alchemyapi.io/nft/v2/${AlchemyApiKey}/getNFTs/?owner=${ownerAddress}`,
            }),
            transformResponse: (resp, meta, ownerAddress) => {
                const result = {
                    ownerAddress,
                    nfts: [],
                };
                try {
                    result.nfts = resp?.ownedNfts.reduce((acc, item) => {
                        const { title, error } = item;
                        if (!error) {
                            acc.push({
                                title,
                                contractAddress: item?.contract?.address,
                                tokenId: title + item.id.tokenId,
                                imageUrl: item.media[0]["gateway"],
                            });
                        }
                        return acc;
                    }, []);
                } catch (error) {
                    console.log("api getNfts error, ", error);
                }

                return result;
            },
        }),
        getNftFloorPrice: builder.query({
            query: (contractAddress) => ({
                url: `https://eth-mainnet.alchemyapi.io/nft/v2/${AlchemyApiKey}/getFloorPrice/?contractAddress=${contractAddress}`,
            }),
            transformResponse: (resp, meta, contractAddress) => {
                const { openSea, looksRare } = resp;
                const result = { contractAddress };
                if (openSea.error && looksRare.error) {
                    result.error = openSea.error;
                } else if (looksRare.error) {
                    result.floorPrice = openSea.floorPrice;
                    result.priceCurrency = openSea.priceCurrency;
                } else {
                    result.floorPrice = looksRare.floorPrice;
                    result.priceCurrency = looksRare.priceCurrency;
                }
                return result;
            },
        }),
        getTokenBalance: builder.query({
            query: (ownerAddress) => ({
                url: `https://deep-index.moralis.io/api/v2/${ownerAddress}/erc20?chain=eth`,
                headers: {
                    "X-API-Key": MoralisApiKey,
                    "accept": "application/json",
                },
            }),
            transformResponse: (resp, meta, ownerAddress) => {
                let filterTokens = [];
                try {
                    filterTokens = resp.reduce((acc, tokenData) => {
                        const {
                            token_address,
                            symbol,
                            thumbnail,
                            balance,
                            decimals,
                        } = tokenData;
                        if (
                            SupportTokens[symbol] &&
                            SupportTokens[symbol]["token_address"] ===
                                token_address
                        ) {
                            acc.push({
                                symbol,
                                thumbnail,
                                balance: Number(balance) / 10 ** decimals,
                            });
                        }
                        return acc;
                    }, []);
                } catch (error) {
                    console.log("api getTokenBalance error, ", error);
                }

                return {
                    ownerAddress,
                    tokens: filterTokens,
                };
            },
        }),
        getNativeTokenBalance: builder.query({
            query: (ownerAddress) => ({
                url: `https://deep-index.moralis.io/api/v2/${ownerAddress}/balance?chain=eth`,
                headers: {
                    "X-API-Key": MoralisApiKey,
                    "accept": "application/json",
                },
            }),
            transformResponse: (resp, meta, ownerAddress) => {
                return {
                    ownerAddress,
                    balance: resp.balance,
                };
            },
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetCryptoPricesQuery,
    useGetNftsQuery,
    useGetNftFloorPriceQuery,
    useGetTokenBalanceQuery,
    useGetNativeTokenBalanceQuery,
} = api;
