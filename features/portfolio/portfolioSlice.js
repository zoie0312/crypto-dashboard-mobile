import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    referenceCurrency: 'USD',
    //totalValue: 0,
    //tokensWorth: 0,
    //nftsWorth: 0,
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
};

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        addWallet: (state, action) => {
            const {chain, address} = action.payload;
            const found = state.wallets.find(wallet => wallet.chain === chain && wallet.address === address);
            if (!found) {
                state.wallets.push({
                    chain,
                    address,
                    nftAssets: null,
                    tokenAssets: null
                })
            }
        },
        removeWallet: (state, action) => {
            const {chain, address} = action.payload;
            state.wallets = state.wallets.filter(wallet => (wallet.chain !== chain) || (wallet.address !== address));
        }
    }
})

export const {addWallet, removeWallet} = portfolioSlice.actions;

export default portfolioSlice.reducer