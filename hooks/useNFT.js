/*
* using Alchemy api
* this returns NFTs under a wallet address
*/

import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'

const apiKey = "5i3nUfMDsESoLsuo1FwKSTuA78J0fiP8";
const chainToCurrency = {
    'ethereum': 'eth'
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
            const {result, chain} = action.payload;
            const nftData = result.ownedNfts.reduce((acc, item) => {
                if (!item.error) {
                    acc.push({
                        title: item.title,
                        imageUrl: item.media[0]['gateway'],
                        contractAddress: item.contract.address,
                        currency: chainToCurrency[chain],
                        error: item.error,
                        tokenId: item.title + item.id.tokenId
                    });
                }
                return acc;
            }, []);
            return {
                ...state,
                isLoading: false,
                isError: false,
                nftData,
            }
        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
                nftData: []
            }
        default:
            throw new Error()
    }
}

const useNFT = ({ ownerAddr, chain }) => {
    const [reload, setReload] = useState(0);

    //console.log('useNFT called');
    //console.log('ownerAddr= ', ownerAddr);
    //console.log('reload= ', reload)
    // console.log('chain= ', chain);
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        nftData: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' })

            const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTs/`;
            
            try {
                const config = {
                    method: 'get',
                    url: `${baseURL}?owner=${ownerAddr}`
                };
                
                const resp = await axios(config);
                //const result = JSON.stringify(resp.data);
                const result = resp.data;
                //console.log('got axios result= ', result);
                dispatch({ type: 'FETCH_SUCCESS', payload: { result, chain }})
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE' })
            }
        }

        //if (reload) {
            fetchData();
        //}
                
        return () => {
            //setReload(false);
        }
    }, [ownerAddr, chain, reload])

    return [state, setReload];
}

export default useNFT
