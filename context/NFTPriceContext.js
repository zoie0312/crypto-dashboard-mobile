import {createContext, useReducer, useEffect} from 'react'
import cloneDeep from 'lodash.clonedeep'

// const SampleState = {
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
// } 

const InitialState = {
    nftPrices: []
};

const reducer = (state, action) => {
    //console.log('NFTPriceContext reducer, ', action.type);
    const nextState = cloneDeep(state);

    switch (action.type) {
        case 'UPDATE_NFT_PRICES':
            const { priceData, chain } = action.payload;
            
            const existingPriceDataOfChain = nextState.nftPrices.find(item => item.chain === chain);
            if (existingPriceDataOfChain) {
                priceData.forEach(data => {
                    const {contractAddress, floorPrice, priceCurrency, floorPriceInUSD} = data;
                    const targetNft = existingPriceDataOfChain.nftPriceData.find(item => item.contractAddress === contractAddress);
                    if (!targetNft) {
                        existingPriceDataOfChain.nftPriceData.push({
                            contractAddress,
                            floorPrice,
                            priceCurrency,
                            floorPriceInUSD
                        })
                    }else {
                        targetNft.floorPrice = floorPrice;
                        targetNft.priceCurrency = priceCurrency;
                        targetNft.floorPriceInUSD = floorPriceInUSD;
                    }
                    
                })
            }else {
                nextState.nftPrices.push({
                    chain,
                    nftPriceData: priceData
                }) 
            }
            //console.log('new NFTPrice state ', nextState);
            break;
        
        default: 
            throw new Error();
    }

    return nextState;
}

export const NFTPriceContext = createContext(InitialState);

export const NFTPriceContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, InitialState);

    const updateNftPrices = ({priceData, chain}) => {
        dispatch({
            type: 'UPDATE_NFT_PRICES',
            payload: {
                priceData,
                chain
            }
        })
    }
    
    return (
        <NFTPriceContext.Provider
            value={{...state, dispatch}}
        >
            {props.children}
        </NFTPriceContext.Provider>
    )
    
}