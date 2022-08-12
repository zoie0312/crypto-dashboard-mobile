import { createSlice, createSelector } from "@reduxjs/toolkit";

import { api as apiSlice } from "../../app/services/api";
import { SupportTokens } from "../../app/utils/SupportTokens";

const NativeTokens = {
    ethereum: "ETH",
};

const initialState = {
    referenceCurrency: "USD",
    tokensWorth: 0,
    nftsWorth: 0,
    wallets: [
        // {
        //     chain: 'ethereum',
        //     address: '0x11e4857bb9993a50c685a79afad4e6f65d518dda',
        //     nativeBalance: 0,
        //     tokensWorth: 0,
        //     nftsWorth: 0,
        //     tokenAssets: [],
        //     nftAssets: []
        // }
    ],
    nftPrices: {},
    cryptoPrices: {},
};

export const portfolioSlice = createSlice({
    name: "portfolio",
    initialState,
    reducers: {
        addWallet: (state, action) => {
            const { chain, address } = action.payload;
            const found = state.wallets.find(
                (wallet) => wallet.chain === chain && wallet.address === address
            );
            if (!found) {
                state.wallets.push({
                    chain,
                    address,
                    nftAssets: [],
                    tokenAssets: [],
                });
            }
        },
        removeWallet: (state, action) => {
            const { chain, address } = action.payload;
            state.wallets = state.wallets.filter(
                (wallet) => wallet.chain !== chain || wallet.address !== address
            );
        },
    },
    extraReducers(builder) {
        builder
            .addMatcher(
                apiSlice.endpoints.getCryptoPrices.matchFulfilled,
                (state, action) => {
                    state.cryptoPrices = action.payload;
                }
            )
            .addMatcher(
                apiSlice.endpoints.getTokenBalance.matchFulfilled,
                (state, action) => {
                    const cryptoPrices = state.cryptoPrices;
                    const { tokens, ownerAddress } = action.payload;
                    const targetWallet = state.wallets.find(
                        (wallet) => wallet.address === ownerAddress
                    );
                    if (targetWallet) {
                        const newTokenAssets = [...tokens];

                        const nativeTokenSymbol =
                            NativeTokens[targetWallet.chain];
                        newTokenAssets.push({
                            symbol: nativeTokenSymbol,
                            thumbnail:
                                SupportTokens[nativeTokenSymbol]["thumbnail"],
                            balance: targetWallet.nativeBalance
                                ? Number(targetWallet.nativeBalance) / 10 ** 18
                                : 0,
                        });
                        targetWallet.tokenAssets = newTokenAssets;

                        //update portfolio tokensWorth
                        let tokensWorth = 0;
                        state.wallets.forEach((wallet) => {
                            let walletTokensWorth = 0;

                            wallet.tokenAssets &&
                                wallet.tokenAssets.forEach((token) => {
                                    if (wallet === targetWallet) {
                                        token.exchangeRate =
                                            cryptoPrices[token.symbol]?.[
                                                "USD"
                                            ] || 0;
                                    }
                                    walletTokensWorth +=
                                        token["balance"] * token["exchangeRate"]
                                            ? token["balance"] *
                                              token["exchangeRate"]
                                            : 0;
                                });
                            wallet.tokensWorth = walletTokensWorth;
                            tokensWorth += walletTokensWorth;
                        });
                        state.tokensWorth = tokensWorth;
                        targetWallet.tokenAssets =
                            targetWallet.tokenAssets.sort(
                                (token1, token2) =>
                                    token2.balance * token2.exchangeRate -
                                    token1.balance * token1.exchangeRate
                            );
                    }
                }
            )
            .addMatcher(
                apiSlice.endpoints.getNativeTokenBalance.matchFulfilled,
                (state, action) => {
                    const cryptoPrices = state.cryptoPrices;
                    const { ownerAddress, balance } = action.payload;
                    const targetWallet = state.wallets.find(
                        (wallet) => wallet.address === ownerAddress
                    );
                    if (targetWallet) {
                        targetWallet.nativeBalance = balance;
                        const nativeTokenSymbol =
                            NativeTokens[targetWallet.chain];
                        const nativeToken =
                            targetWallet.tokenAssets &&
                            targetWallet.tokenAssets.find(
                                (token) =>
                                    token.symbol ===
                                    NativeTokens[targetWallet.chain]
                            );
                        if (nativeToken) {
                            nativeToken.exchangeRate =
                                cryptoPrices[nativeTokenSymbol]?.["USD"] || 0;
                            const diff =
                                (Number(balance) / 10 ** 18 -
                                    nativeToken.balance) *
                                nativeToken.exchangeRate;
                            targetWallet.tokensWorth += diff;
                            state.tokensWorth += diff;
                        } else {
                            const nativeTokenEntity = {
                                symbol: nativeTokenSymbol,
                                thumbnail:
                                    SupportTokens[nativeTokenSymbol][
                                        "thumbnail"
                                    ],
                                balance: Number(balance) / 10 ** 18,
                                exchangeRate:
                                    cryptoPrices[nativeTokenSymbol]?.["USD"] ||
                                    0,
                            };
                            targetWallet.tokenAssets.push(nativeTokenEntity);
                            targetWallet.tokensWorth +=
                                nativeTokenEntity.balance *
                                nativeTokenEntity.exchangeRate;
                            state.tokensWorth +=
                                nativeTokenEntity.balance *
                                nativeTokenEntity.exchangeRate;
                        }
                        targetWallet.tokenAssets =
                            targetWallet.tokenAssets.sort(
                                (token1, token2) =>
                                    token2.balance * token2.exchangeRate -
                                    token1.balance * token1.exchangeRate
                            );
                    }
                }
            )
            .addMatcher(
                apiSlice.endpoints.getNfts.matchFulfilled,
                (state, action) => {
                    const nftPrices = state.nftPrices;
                    const cryptoPrices = state.cryptoPrices;
                    const { ownerAddress, nfts } = action.payload;
                    const targetWallet = state.wallets.find(
                        (wallet) => wallet.address === ownerAddress
                    );
                    if (targetWallet) {
                        const nftAssets = targetWallet.nftAssets
                            ? targetWallet.nftAssets
                            : [];
                        const newNFTs = [];
                        const rawData = nfts;
                        rawData &&
                            rawData.forEach((item) => {
                                const {
                                    title,
                                    contractAddress,
                                    imageUrl,
                                    tokenId,
                                } = item;
                                const found = nftAssets.find(
                                    (asset) => asset.tokenId === tokenId
                                );
                                if (!found) {
                                    let floorPrice,
                                        floorPriceInUSD,
                                        priceCurrency = "ETH";
                                    if (
                                        nftPrices &&
                                        nftPrices[contractAddress] &&
                                        !nftPrices[contractAddress]["error"]
                                    ) {
                                        floorPrice =
                                            nftPrices[contractAddress]
                                                .floorPrice;
                                        priceCurrency =
                                            nftPrices[contractAddress]
                                                .priceCurrency;
                                    }
                                    if (
                                        floorPrice &&
                                        cryptoPrices &&
                                        cryptoPrices[priceCurrency]
                                    ) {
                                        floorPriceInUSD =
                                            floorPrice *
                                            cryptoPrices[priceCurrency]["USD"];
                                    }
                                    newNFTs.push({
                                        title,
                                        contractAddress,
                                        tokenId,
                                        imageUrl,
                                        floorPrice,
                                        priceCurrency,
                                        floorPriceInUSD,
                                    });
                                }
                            });
                        targetWallet.nftAssets = [...nftAssets, ...newNFTs];
                    }
                }
            )
            .addMatcher(
                apiSlice.endpoints.getNftFloorPrice.matchFulfilled,
                (state, action) => {
                    const {
                        contractAddress,
                        error,
                        floorPrice,
                        priceCurrency,
                    } = action.payload;
                    const cryptoPrices = state.cryptoPrices;
                    if (!error) {
                        state.nftPrices[contractAddress] = {
                            floorPrice,
                            priceCurrency,
                            contractAddress,
                        };
                        let nftsWorth = 0;
                        state.wallets.forEach((wallet) => {
                            let walletNftsWorth = 0;
                            wallet.nftAssets &&
                                wallet.nftAssets.forEach((nft) => {
                                    if (
                                        nft.contractAddress === contractAddress
                                    ) {
                                        nft.floorPrice = floorPrice;
                                        nft.priceCurrency = priceCurrency;
                                        if (
                                            cryptoPrices &&
                                            cryptoPrices[priceCurrency]
                                        ) {
                                            nft.floorPriceInUSD =
                                                floorPrice *
                                                cryptoPrices[priceCurrency][
                                                    "USD"
                                                ];
                                        }
                                    }
                                    walletNftsWorth += nft.floorPriceInUSD
                                        ? nft.floorPriceInUSD
                                        : 0;
                                });
                            nftsWorth += walletNftsWorth;
                        });
                        state.nftsWorth = nftsWorth;
                    }
                }
            );
    },
});

const selectAllWallets = (state) => state.portfolio.wallets;

export const selectNftsByWallet = createSelector(
    [
        selectAllWallets,
        (state, walletAddress) => walletAddress,
        (state, walletAddress, chain) => chain,
    ],
    (wallets, walletAddress, chain) => {
        const targetWallet = wallets.find(
            (wallet) =>
                wallet.chain === chain && wallet.address === walletAddress
        );
        return targetWallet?.nftAssets || [];
    }
);

export const selectTokensByWallet = createSelector(
    [
        selectAllWallets,
        (state, walletAddress) => walletAddress,
        (state, walletAddress, chain) => chain,
    ],
    (wallets, walletAddress, chain) => {
        const targetWallet = wallets.find(
            (wallet) =>
                wallet.chain === chain && wallet.address === walletAddress
        );
        return targetWallet?.tokenAssets || [];
    }
);

export const { addWallet, removeWallet } = portfolioSlice.actions;

export default portfolioSlice.reducer;
