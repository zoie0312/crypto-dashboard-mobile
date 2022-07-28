import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {SupportTokens} from '../utils/SupportTokens'

const TOKEN_LIST = Object.keys(SupportTokens).reduce((acc, symbol, idx) => {
    acc += idx===0 ? symbol.toString() : `,${symbol.toString()}`
    return acc;
}, '');

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getCryptoPrices: builder.query({
      query: () => ({
        url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${TOKEN_LIST}&tsyms=USD`
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCryptoPricesQuery } = api