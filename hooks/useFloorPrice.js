/*
* using Alchemy api
* this returns floor price of a NFT collection
*/

import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'

const apiKey = "5i3nUfMDsESoLsuo1FwKSTuA78J0fiP8";
const InitialPriceData = {
    floorPrice: 0,
    priceCurrency: 'ETH'
}

const dataFetchReducer = (state, action) => {
    
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        case 'FETCH_SUCCESS':
            const {result, cryptoPrices} = action.payload;
            const priceData = {
                floorPrice: result['openSea']['floorPrice'] || 0,
                priceCurrency: result['openSea']['priceCurrency'] || 'ETH'
            };
            priceData['floorPriceInUSD'] = priceData.floorPrice * cryptoPrices[priceData.priceCurrency]['USD'];
            return {
                ...state,
                isLoading: false,
                isError: false,
                priceData 
            }
        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
                priceData: {}
            }
        default:
            throw new Error()
    }
}

const useFloorPrice = ({ contractAddress, updateNFTPrice, cryptoPrices }) => {
    //const [running, setRunning] = useState(false);

    // console.log('useFloorPrice called');
    // console.log('contractAddr= ', contractAddress);
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        priceData: InitialPriceData,
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' })

            const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getFloorPrice/`;
            
            try {
                const config = {
                    method: 'get',
                    url: `${baseURL}?contractAddress=${contractAddress}`
                };
                
                const resp = await axios(config);
                const result = resp.data;
                //console.log('got axios result= ', result);
                dispatch({ type: 'FETCH_SUCCESS', payload: {result, cryptoPrices}});
                updateNFTPrice({contractAddress, result, cryptoPrices});
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE' })
            }
        }

        fetchData()
        
        return () => {
        }
    }, [contractAddress]); //don't need to add updateNFTPrice as dependency as it's from PortfolioContext

    return {...state};
}

export default useFloorPrice
