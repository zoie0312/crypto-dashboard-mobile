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
            const result = action.payload;
            return {
                ...state,
                isLoading: false,
                isError: false,
                priceData: {
                    floorPrice: result['openSea']['floorPrice'],
                    priceCurrency: result['openSea']['priceCurrency']
                }
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

const useFloorPrice = ({ contractAddress }) => {
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
                dispatch({ type: 'FETCH_SUCCESS', payload: result})
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE' })
            }
        }

        fetchData()
        
        return () => {
        }
    }, [contractAddress])

    return {...state};
}

export default useFloorPrice
