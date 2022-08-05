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
    
    fetchPriceTasks = contractAddresses.map(address => {
        const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${apiKey}/getFloorPrice/`;
        const config = {
            method: 'get',
            url: `${baseURL}?contractAddress=${address}`
        };
        return axios(config).then(resp =>  ({
            contractAddress: address,
            data: resp.data
        }));
    });
    
    return Promise.allSettled(fetchPriceTasks);
}

const useNFT = ({address, chain, isLoaded, portfolioDispatch, nftPriceDispatch, cryptoPrices}) => {

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
                portfolioDispatch(
                    {
                        type: 'UPDATE_PORTFOLIO_NFTS',
                        payload: { fetchResult: result, address, chain }
                    }
                )
                let nftAddresses = result.ownedNfts && result.ownedNfts.reduce((acc, item) => {
                    if (!item.error) {
                        acc.push(item.contract.address);
                    }
                    return acc;
                }, []);
                nftAddresses = [...new Set(nftAddresses)];
                
                //continue to fetch NFT floor prices
                const priceData = await fetchFloorPrices(nftAddresses);
                const nftPrices = priceData.reduce((acc, item) => {
                    const {contractAddress, data: {openSea, looksRare}} = item.value;
                    const result = { contractAddress }
                    if (openSea.error && looksRare.error) {
                        return acc;
                    } else if (looksRare.error) {
                        result.floorPrice = openSea.floorPrice;
                        result.priceCurrency = openSea.priceCurrency;
                    } else {
                        result.floorPrice = looksRare.floorPrice;
                        result.priceCurrency = looksRare.priceCurrency;
                    }
                    result.floorPriceInUSD = result.floorPrice * cryptoPrices[result.priceCurrency]['USD'];
                    acc.push(result);
                    return acc;
                }, [])
                //console.log('nftPrices ', nftPrices);
                nftPriceDispatch(
                    {
                        type: 'UPDATE_NFT_PRICES',
                        payload: {
                            priceData: nftPrices,
                            chain
                        }
                    }
                );
                portfolioDispatch(
                    {
                        type: 'UPDATE_NFT_PRICES',
                        payload: {
                            priceData: nftPrices,
                            chain
                        }
                    }
                )
            } catch (error) {
                console.log('useNFT: ', error)
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
