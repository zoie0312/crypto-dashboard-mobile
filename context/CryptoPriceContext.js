import {createContext, useReducer, useEffect} from 'react'

const InitialState = {
    btc: 20000, 
    eth: 1000
},

// const InitialContext = {
//     ...InitialState,
//     setBtc: (btcPrice) => {},
//     setEth: (ethPrice) => {}
// }

const reducer = (state, action) => {
    const nextState = {...state};

    switch (action.payload) {
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
    const [state, dispatch] = useReducer(reducer, InitialState);

    

    return (
        <CryptoPriceContext.Provider
            value={{...state}}
        >
            {props.children}
        </CryptoPriceContext.Provider>
    )
    
}