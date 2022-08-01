/*
* using Moralis api
* this returns token assets under a wallet address
*/
import { useState, useEffect, useReducer, useCallback } from 'react'
import axios from 'axios'
import {SupportTokens} from '../../app/utils/SupportTokens'

const apiKey = 'EO0m8AeCWdXWsaK0faFFvLGBPwo8ie2B3Sw78W3stNYOVKkEvtL2O90ISog80p9s';

const dataFetchReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        case 'FETCH_SUCCESS':
            const {tokenAsset, chain} = action.payload;
            return {
                ...state,
                isLoading: false,
                isError: false,
                tokenAsset,
            }
        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            }
        default:
            throw new Error()
    }
}

const useWallet = ({address, chain, isLoaded, portfolioDispatch, cryptoPrices}) => {
    //const [running, setRunning] = useState(false);

    console.log('useWallet called')
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        tokenAsset: [],
    })

    const fetchData = useCallback(() => {
        const ownerAddr = address;
        const doFetchData = async () => {
            dispatch({ type: 'FETCH_INIT' })

            try {
                const balanceUrl = `https://deep-index.moralis.io/api/v2/${ownerAddr}/erc20?chain=eth`;
                const nativeBalanceUrl = `https://deep-index.moralis.io/api/v2/${ownerAddr}/balance?chain=eth`;
                const balanceConfig = {
                    method: 'get',
                    url: balanceUrl,
                    headers: {
                        'X-API-Key': apiKey,
                        'accept': 'application/json'
                    }
                };
                const nativeBalanceConfig = {
                    method: 'get',
                    url: nativeBalanceUrl,
                    headers: {
                        'X-API-Key': apiKey,
                        'accept': 'application/json'
                    }
                };
                const [result, nativeResult] = await Promise.all([axios(balanceConfig), axios(nativeBalanceConfig)]); 
                console.log('fetch tokens result ', result);
                const filterResult = result.data.filter(token => {
                    return  SupportTokens[token.symbol] && 
                        (SupportTokens[token.symbol]['token_address'] === token['token_address'])
                });
                let tokenAsset = filterResult.map(tokenData => {
                    const {token_address, symbol, thumbnail, balance, decimals } = tokenData;
                    return {
                        symbol,
                        thumbnail,
                        balance: Number(balance)/10**decimals,
                        exchangeRate: cryptoPrices[symbol]?.['USD'] || 0,
                    }
                });
                tokenAsset.push({
                    symbol: 'ETH',
                    thumbnail: SupportTokens['ETH']['thumbnail'],
                    balance: Number(nativeResult.data.balance)/10**18,
                    exchangeRate: cryptoPrices['ETH']?.['USD'] || 0
                });
                tokenAsset = tokenAsset.sort((token1, token2) => token2.balance * token2.exchangeRate - token1.balance * token1.exchangeRate)
                dispatch({ type: 'FETCH_SUCCESS', payload: {tokenAsset, chain}});
                portfolioDispatch(
                    {
                        type: 'UPDATE_TOKEN_ASSET',
                        payload: {
                            tokenAsset,
                            address: ownerAddr,
                            chain
                        }
                    }
                );
            } catch (error) {
                console.log('useWallet fetchData ', error);
                dispatch({ type: 'FETCH_FAILURE' })
            }
        }

        doFetchData();

    }, [address, chain])

    useEffect(() => {
        if (!isLoaded) {
           fetchData();
        }
                
    }, [isLoaded, fetchData]);

    return [state, fetchData];
}

export default useWallet
