import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'

const TIMER_INTERVAL = 5000;

const dataFetchReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                cryptoPrices: action.payload,
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

const useCryptoPrices = ({ initialData, timerCount }) => {
    //const [running, setRunning] = useState(false);

    console.log('useCryptoPrices called')
    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        cryptoPrices: initialData,
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_INIT' })

            try {
                const options = {
                    method: 'GET',
                    url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,FTT&tsyms=USD',
                }
                const result = await axios.request(options)

                dispatch({ type: 'FETCH_SUCCESS', payload: result.data })
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE' })
            }
        }

        const timer = setInterval(() => {
            fetchData()
        }, TIMER_INTERVAL);

        setTimeout(() => {
          clearInterval(timer);
          console.log('time over');
      }, timerCount * TIMER_INTERVAL);

        return () => {
            clearInterval(timer)
        }
    }, [])

    return state.cryptoPrices
}

export default useCryptoPrices
