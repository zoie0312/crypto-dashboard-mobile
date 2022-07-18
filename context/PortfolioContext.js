import {createContext, useReducer, useEffect} from 'react'
import cloneDeep from 'lodash.clonedeep'
//import useCryptoPrices from '../hooks/useCryptoPrices';

// const SampleState = {
//     referenceCurrency: 'usd',
//     totalValue: 3500,
//     tokensWorth: 2000,
//     nftsWorth: 1000,
//     wallets: [
//         {
//             chain: 'etherum',
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
//     ]
// };
const InitialState = {
    referenceCurrency: 'USD',
    totalValue: 0,
    tokensWorth: 0,
    nftsWorth: 0,
    wallets: [
        {
            chain: 'etherum',
            address: '0x11e4857bb9993a50c685a79afad4e6f65d518dda',
            tokensWorth: 0,
            nftsWorth: 0,
            tokenAssets: [],
            nftAssets: []
        }
    ]
    
};

const InitialContext = {
    ...InitialState,
    dispatch: () => {}
}

const reducer = (state, action) => {
    const nextState = cloneDeep(state);
    console.log('PortfolioContext reducer, ', action.type);
    switch (action.type) {
        case 'ADD_ADDRESS':
            nextState.wallets.push({
                chain: action.payload['chain'],
                address: action.payload['address'],
                nftAssets: [],
                tokenAssets: []
            });
            break;

        case 'UPDATE_PORTFOLIO_NFTS':
            const {nftData, address, chain} = action.payload;
            const targetWallet = nextState.wallets.find(wallet => (wallet.chain === chain) && (wallet.address === address));
            if (targetWallet) {
                const nftAssets = targetWallet.nftAssets;
                const newNFTs = [];
                nftData.forEach(element => {
                    const {title, contractAddress, tokenId} = element;
                    const found = nftAssets.find(asset => (asset.contractAddress === contractAddress) && (asset.title === title));
                    if (!found) {
                        newNFTs.push({
                            title,
                            contractAddress,
                            tokenId,
                            floorPrice: 0,
                            priceCurrency: 'ETH',
                            floorPriceInUSD: 0 
                        });
                    }
                });
                targetWallet.nftAssets = [...nftAssets, ...newNFTs]; 
            }
            //console.log('new portfolio state ', nextState);
            break;

        case 'UPDATE_PORTFOLIO_NFT_PRICE':
            const {floorPriceData, contractAddress} = action.payload;
            const {floorPrice, priceCurrency, floorPriceInUSD} = floorPriceData;
            let nftsWorth = 0;
            nextState.wallets.forEach(wallet => {
                let walletNftsWorth = 0;
                wallet.nftAssets.forEach(nft => {
                    if (nft.contractAddress === contractAddress) {
                        nft.floorPrice = floorPrice;
                        nft.priceCurrency = priceCurrency;
                        nft.floorPriceInUSD = floorPriceInUSD
                    }
                    walletNftsWorth += nft.floorPriceInUSD ? nft.floorPriceInUSD : 0;
                });
                nftsWorth += walletNftsWorth;
            });
            nextState.nftsWorth = nftsWorth;
            nextState.totalValue = nextState.nftsWorth + nextState.tokensWorth;
            //console.log('new portfolio state ', nextState);
            break;

        default: 
            throw new Error();
    }

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