import {createContext, useReducer, useEffect, useContext} from 'react'
import cloneDeep from 'lodash.clonedeep'
import useCryptoPrices from '../common/hooks/useCryptoPrices';
import {CryptoPriceContext} from './CryptoPriceContext'

// const SampleState = {
//     referenceCurrency: 'usd',
//     totalValue: 3500,
//     tokensWorth: 2000,
//     nftsWorth: 1000,
//     wallets: [
//         {
//             chain: 'ethereum',
//             address: '0x5453653764ddf',
//             tokenAssets: [],
//             nftAssets: [
//                     {
//                         title: 'CryptoPunk 003',
//                         contractAddress: '0x4253456547',
//                         floorPrice: 34.55,
//                         priceCurrency: 'ETH',
//                         floorPriceInUSD: 500.3 
//                     }
//                 ]
//         }
//     ],
//     nftPrices: [
//         {
//             chain: 'ethereum',
//             nftPriceData: [
//                 {
//                     contractAddress: '0x534647777',
//                     floorPrice: 0.3,
//                     priceCurrency: "ETH",
//                     floorPriceInUSD: 1000 
//                 }
//             ]
//         }
//     ]
// };

const InitialState = {
    referenceCurrency: 'USD',
    totalValue: 0,
    tokensWorth: 0,
    nftsWorth: 0,
    wallets: [
        // {
        //     chain: 'ethereum',
        //     address: '0x11e4857bb9993a50c685a79afad4e6f65d518dda',
        //     tokensWorth: 0,
        //     nftsWorth: 0,
        //     tokenAssets: [],
        //     nftAssets: []
        // }
    ],
    nftPrices: []
    
};

const InitialContext = {
    ...InitialState,
    dispatch: () => {}
}

const reducer = (state, action) => {
    const nextState = cloneDeep(state);
    const {address, chain} = action.payload;
    const targetWallet = nextState.wallets.find(wallet => (wallet.chain === chain) && (wallet.address === address));
    console.log('PortfolioContext reducer, ', action.type);
    
    switch (action.type) {
        case 'ADD_ADDRESS':
            nextState.wallets.push({
                chain: action.payload['chain'],
                address: action.payload['address'],
                nftAssets: null,
                tokenAssets: null
            });
            break;

        case 'REMOVE_ADDRESS':
            nextState.wallets = nextState.wallets.filter(wallet => (wallet.chain !== action.payload.chain) || (wallet.address !== action.payload.address));
            break; 

        case 'UPDATE_TOKEN_ASSET':
            const { tokenAsset } = action.payload;
            
            if (targetWallet) {
                targetWallet.tokenAssets = tokenAsset;
            }
            let tokensWorth = 0;
            nextState.wallets.forEach(wallet => {
                let walletTokensWorth = 0;
                wallet.tokenAssets && wallet.tokenAssets.forEach(token => {
                    walletTokensWorth += token['balance']*token['exchangeRate'] ? token['balance']*token['exchangeRate'] : 0;
                });
                tokensWorth += walletTokensWorth;
            });
            nextState.tokensWorth = tokensWorth;
            nextState.totalValue = nextState.nftsWorth + nextState.tokensWorth;
            console.log('new portfolio state ', nextState);
            break;

        case 'UPDATE_PORTFOLIO_NFTS':
            const { fetchResult } = action.payload;
            if (targetWallet) {
                const nftAssets = targetWallet.nftAssets ? targetWallet.nftAssets : [];
                const newNFTs = [];
                const rawData = fetchResult.ownedNfts;
                rawData && rawData.forEach(item => {
                    const { error, title } = item;
                    if (!error) {
                        const contractAddress = item.contract.address;
                        const found = nftAssets.find(asset => (asset.contractAddress === contractAddress) && (asset.title === title));
                        if (!found) {
                            newNFTs.push({
                                title,
                                contractAddress,
                                tokenId: title + item.id.tokenId,
                                imageUrl: item.media[0]['gateway'],
                                floorPrice: '',
                                priceCurrency: 'ETH',
                                floorPriceInUSD: ''
                            });
                        }
                    }
                    
                });
                targetWallet.nftAssets = [...nftAssets, ...newNFTs]; 
            }
            //console.log('new portfolio stat ', nextState);
            break;

        // case 'UPDATE_PORTFOLIO_NFT_PRICE':
        //     const { rawData, contractAddress, cryptoPrices } = action.payload;
        //     if (rawData) {
        //         const floorPrice= rawData['openSea'] ? 
        //                 rawData['openSea']['floorPrice'] : rawData['looksRare'] ? 
        //                 rawData['looksRare']['floorPrice'] : 0;
        //         const priceCurrency= rawData['openSea'] ? 
        //                 rawData['openSea']['priceCurrency'] : rawData['looksRare'] ? 
        //                 rawData['looksRare']['priceCurrency'] : 'ETH';
                
        //         let floorPriceInUSD;
        //         if (floorPrice) {
        //             floorPriceInUSD = floorPrice * cryptoPrices[priceCurrency]['USD'];
        //         }
        //         let nftsWorth = 0;
        //         nextState.wallets.forEach(wallet => {
        //             let walletNftsWorth = 0;
        //             wallet.nftAssets.forEach(nft => {
        //                 if (nft.contractAddress === contractAddress) {
        //                     nft.floorPrice = floorPrice;
        //                     nft.priceCurrency = priceCurrency;
        //                     nft.floorPriceInUSD = floorPriceInUSD
        //                 }
        //                 walletNftsWorth += nft.floorPriceInUSD ? nft.floorPriceInUSD : 0;
        //             });
        //             nftsWorth += walletNftsWorth;
        //         });
        //         nextState.nftsWorth = nftsWorth;
        //         nextState.totalValue = nextState.nftsWorth + nextState.tokensWorth;
        //     }
        //     break;

        case 'UPDATE_NFT_PRICES':
            const { priceData, chain: nftChain } = action.payload;
            
            //update wallet nftAssests
            const addressPriceMap = priceData.reduce((acc, data) => {
                const {contractAddress, floorPrice, priceCurrency, floorPriceInUSD} = data;
                acc[contractAddress] = {
                    floorPrice,
                    priceCurrency,
                    floorPriceInUSD
                } 
                return acc;
            },{});
            let nftsWorth = 0;
            nextState.wallets.forEach(wallet => {
                let walletNftsWorth = 0;
                wallet.nftAssets && wallet.nftAssets.forEach(nft => {
                    if (wallet.chain === nftChain) {
                        const updatePriceData = addressPriceMap[nft.contractAddress];
                        if (updatePriceData) {
                            const {floorPrice, priceCurrency, floorPriceInUSD} = updatePriceData;
                            nft.floorPrice = floorPrice;
                            nft.priceCurrency = priceCurrency;
                            nft.floorPriceInUSD = floorPriceInUSD
                        }    
                    }
                    walletNftsWorth += nft.floorPriceInUSD ? nft.floorPriceInUSD : 0;
                });
                nftsWorth += walletNftsWorth;
            });
            nextState.nftsWorth = nftsWorth;
            nextState.totalValue = nextState.nftsWorth + nextState.tokensWorth;
            //console.log('new portfolio stat ', nextState);
            break;

        default: 
            throw new Error();
    }
    //console.log('new portfolio state ', nextState);
    return nextState;
}

export const PortfolioContext = createContext();

export const PortfolioContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, InitialState);
    
    return (
        <PortfolioContext.Provider
            value={{...state, dispatch}}
        >
            {props.children}
        </PortfolioContext.Provider>
    )
    
}