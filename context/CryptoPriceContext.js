import {createContext, useReducer, useEffect} from 'react'
import useCryptoPrices from '../common/hooks/useCryptoPrices';

const InitialState = {
    BTC: {USD: 1}, 
    ETH: {USD: 1},
    FTT: {USD: 1},
};

// const InitialContext = {
//     ...InitialState,
//     setBtc: (btcPrice) => {},
//     setEth: (ethPrice) => {}
// }

const reducer = (state, action) => {
    const nextState = {...state};

    switch (action.type) {
        case 'UPDATE_PRICE':
            nextState.btc = action.payload;
            break;
        
        default: 
            throw new Error();
    }

    return nextState;
}

export const CryptoPriceContext = createContext(InitialState);

export const CryptoPriceContextProvider = (props) => {
    //const [state, dispatch] = useReducer(reducer, InitialState);
    const cryptoPrices = useCryptoPrices({initialData: InitialState, timerCount: 0});
    //console.log('CryptoPriceContext cryptoPrices= ', cryptoPrices);
    return (
        <CryptoPriceContext.Provider
            value={{...cryptoPrices}}
        >
            {props.children}
        </CryptoPriceContext.Provider>
    )
    
}