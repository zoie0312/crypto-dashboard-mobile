/*
* using Alchemy api
* this returns NFTs under a wallet address
*/

import { useState, useEffect, useReducer, useCallback } from 'react'
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

const fetchFloorPrices = (contractAddresses) => {
    //const nftPrices = [];
    const fetchPrice = async (address) => {
        const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getFloorPrice/`;
        try {
            const config = {
                method: 'get',
                url: `${baseURL}?contractAddress=${address}`
            };
            
            const resp = await axios(config);
            const result = resp.data;
            //console.log('got axios result= ', result);
            const floorPrice= result['openSea'] ? 
            result['openSea']['floorPrice'] : result['looksRare'] ? 
            result['looksRare']['floorPrice'] : NaN;
            const priceCurrency= result['openSea'] ? 
            result['openSea']['priceCurrency'] : result['looksRare'] ? 
            result['looksRare']['priceCurrency'] : 'ETH';
                            
            // nftPrices.push({
            //     contractAddress: address,
            //     floorPrice,
            //     priceCurrency
            // })
            return {
                contractAddress: address,
                floorPrice,
                priceCurrency
            }
            
        } catch (error) {
            console.log('fetch price error, ', error);
        }
    }
    // contractAddresses.forEach(async (address) => {
    //     const found = nftPrices.find(nft => nft.contractAddress === address);
    //     if (!found) {
    //         await fetchPrice(address);
    //     }
    // });
    fetchPriceTasks = contractAddresses.map(address => {
        return fetchPrice(address);
    })
    return Promise.allSettled(fetchPriceTasks);
}

const useNFT = ({address, chain, isLoaded, updateNFT, updateNftPrices}) => {

    //console.log('useNFT called');
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        nftData: [],
    });

    const fetchData = useCallback(() => {
        const ownerAddr = address;
        const doFetchData = async () => {
            dispatch({ type: 'FETCH_INIT' })

            const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getNFTs/`;
            
            try {
                const config = {
                    method: 'get',
                    url: `${baseURL}?owner=${ownerAddr}`
                };
                
                const resp = await axios(config);
                const result = resp.data;
                //console.log('got axios result= ', result);
                dispatch({ type: 'FETCH_SUCCESS', payload: { result, chain }});
                updateNFT({ fetchResult: result, address, chain });
                let nftAddresses = result.ownedNfts && result.ownedNfts.reduce((acc, item) => {
                    if (!item.error) {
                        acc.push(item.contract.address);
                    }
                    return acc;
                }, []);
                nftAddresses = [...new Set(nftAddresses)];
                const nftPrices = await fetchFloorPrices(nftAddresses);
                updateNftPrices({priceData: nftPrices, chain});
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE' })
            } 
        }

        doFetchData();
    }, [address, chain]); //don't need to add updateNFT as dependency as it's from PortfolioContext

    useEffect(() => {
        if (!isLoaded) {
           fetchData();
        }
                
    }, [isLoaded, fetchData]);

    return [state, fetchData];
}

export default useNFT
