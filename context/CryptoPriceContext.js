import { createContext } from "react";

import useCryptoPrices from "../common/hooks/useCryptoPrices";

const InitialState = {
    BTC: { USD: 1 },
    ETH: { USD: 1 },
    FTT: { USD: 1 },
};

// const InitialContext = {
//     ...InitialState,
//     setBtc: (btcPrice) => {},
//     setEth: (ethPrice) => {}
// }

export const CryptoPriceContext = createContext(InitialState);

export const CryptoPriceContextProvider = (props) => {
    //const [state, dispatch] = useReducer(reducer, InitialState);
    const cryptoPrices = useCryptoPrices({
        initialData: InitialState,
        timerCount: 0,
    });
    //console.log('CryptoPriceContext cryptoPrices= ', cryptoPrices);
    return (
        <CryptoPriceContext.Provider value={{ ...cryptoPrices }}>
            {props.children}
        </CryptoPriceContext.Provider>
    );
};
